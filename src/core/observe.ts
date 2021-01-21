import { Container } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
import { TaskQueue } from 'aurelia-task-queue';
import { bindable, CompositionContext, CompositionEngine, customElement, noView, View, ViewResources, ViewSlot } from 'aurelia-templating';
import { Observable, Subscription } from 'rxjs';
import { ViewLocator } from 'aurelia-templating';
import { Navigating } from 'core/navigating';

@noView
@customElement('observe')
export class Observe {
  static inject() {
    return [DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue, ViewLocator, Navigating];
  }

  @bindable view: any;
  @bindable viewModel: any;

  public currentController: any;
  public currentViewModel: any;
  public changes: any;
  public owningView: View;
  public bindingContext: any;
  public overrideContext: any;
  public pendingTask: any;
  public updateRequested: any;
  private subscription: Subscription;
  private dataSubscription: Subscription;

  constructor(public element: Element, public container: Container, public compositionEngine: CompositionEngine,
    public viewSlot: ViewSlot, public viewResources: ViewResources, public taskQueue: TaskQueue,
    public viewLocator: ViewLocator, private navigating: Navigating) {
    this.currentController = null;
    this.currentViewModel = null;
    this.changes = Object.create(null);
  }

  created(owningView: View) {
    this.owningView = owningView;
  }

  private dataViewModel

  async bind(bindingContext: any, overrideContext: any) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    if (this.viewModel instanceof Observable) {
      await new Promise<void>(resolve => {
        this.subscription?.unsubscribe();
        this.subscription = (this.viewModel as Observable<Controller>).subscribe(x => {
          this.dataSubscription?.unsubscribe();
          if (x.data$) {
            this.setViewModel(this.navigating, null);
            this.dataSubscription = x.data$.subscribe(y => {
              if (y && y === this.dataViewModel) return;
              this.setViewModel(x, y);
            });
          } else {
            this.setViewModel(x, null);
          }
          resolve();
        });
      });
    } else {
      this.setViewModel(this.viewModel, null);
    }
    if (!this.pendingTask) {
      processChanges(this);
    }
  }

  private setViewModel(viewModel: object, data: object, view?: string) {
    this.dataViewModel = data;
    this.viewModel = data ?? viewModel;
    this.view = view ?? this.viewLocator.getViewStrategy(viewModel);
    this.changes.viewModel = this.viewModel;
    this.changes.view = this.view;
    this.requestUpdate();
  }

  unbind() {
    this.subscription.unsubscribe();
    this.changes = Object.create(null);
    this.bindingContext = null;
    this.overrideContext = null;
    let returnToCache = true;
    let skipAnimation = true;
    this.viewSlot.removeAll(returnToCache, skipAnimation);
  }

  viewModelChanged(newValue) {
    this.changes.viewModel = newValue;
    this.requestUpdate();
  }

  createInstruction(instruction: CompositionContext): CompositionContext {
    return Object.assign(instruction, {
      bindingContext: this.bindingContext,
      overrideContext: this.overrideContext,
      owningView: this.owningView,
      container: this.container,
      viewSlot: this.viewSlot,
      viewResources: this.viewResources,
      currentController: this.currentController,
      host: this.element
    });
  }

  requestUpdate() {
    if (this.pendingTask || this.updateRequested) { return; }
    this.updateRequested = true;
    this.taskQueue.queueMicroTask(() => {
      this.updateRequested = false;
      processChanges(this);
    });
  }
}

function isEmpty(obj) {
  for (const _ in obj) {
    return false;
  }
  return true;
}

function tryActivateViewModel(vm, model) {
  if (vm && typeof vm.activate === 'function') {
    return Promise.resolve(vm.activate(model));
  }
}

function processChanges(composer: Observe) {
  const changes = composer.changes;
  composer.changes = Object.create(null);

  if (needsReInitialization(changes)) {
    // init context
    let instruction = {
      view: composer.view,
      viewModel: composer.currentViewModel
    } as CompositionContext;

    // apply changes
    instruction = Object.assign(instruction, changes);

    // create context
    instruction = composer.createInstruction(instruction);

    composer.pendingTask = composer.compositionEngine.compose(instruction).then(controller => {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller['viewModel'] : null;
    });
  } else {
    // just try to activate the current view model
    composer.pendingTask = tryActivateViewModel(composer.currentViewModel, changes.model);
    if (!composer.pendingTask) { return; }
  }

  composer.pendingTask = composer.pendingTask
    .then(() => {
      completeCompositionTask(composer);
    }, reason => {
      completeCompositionTask(composer);
      throw reason;
    });
}

function completeCompositionTask(composer) {
  composer.pendingTask = null;
  if (!isEmpty(composer.changes)) {
    processChanges(composer);
  }
}

function needsReInitialization(changes: any) {
  return 'view' in changes || 'viewModel' in changes
}

export interface Controller {
  data$: Observable<object>;
}

export const isController = (x: any): x is Controller => {
  return Boolean(x.data$);
}
