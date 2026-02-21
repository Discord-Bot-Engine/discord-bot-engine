import { s as setContext, z as derived, l as getContext, p as push, v as copy_payload, w as assign_payload, u as bind_props, e as pop, x as spread_props, q as spread_attributes, g as escape_html, y as props_id, j as attr, t as clsx } from './index-Ct39Tk77.js';
import { M as MediaQuery, C as Context, s as simpleBox, e as createBitsAttrs, t as tv, c as cn, m as mergeProps, d as boxWith, w as watch, a as createId, D as DOMContext, f as attachRef, g as boolToEmptyStrOrUndef, h as getWindow, i as executeCallbacks, j as getDocument, u as useId } from './use-id-r7Hqn7_D.js';
import { D as Dialog_content, a as Dialog_close, X, P as Portal, c as Dialog_overlay, n as noop, F as Floating_layer, e as PresenceManager, f as Floating_layer_anchor, g as Popper_layer_force_mount, h as Popper_layer, i as isFocusVisible, j as isElement, k as getFloatingContentCSSVars, l as boxAutoReset, m as isHTMLElement, o as FloatingArrowState } from './x-BKdX8_Hm.js';
import { t as on } from './events-ClNAEvdo.js';

const DEFAULT_MOBILE_BREAKPOINT = 768;
class IsMobile extends MediaQuery {
  constructor(breakpoint = DEFAULT_MOBILE_BREAKPOINT) {
    super(`max-width: ${breakpoint - 1}px`);
  }
}
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
class SidebarState {
  props;
  #open = derived(() => this.props.open());
  get open() {
    return this.#open();
  }
  set open($$value) {
    return this.#open($$value);
  }
  openMobile = false;
  setOpen;
  #isMobile;
  #state = derived(() => this.open ? "expanded" : "collapsed");
  get state() {
    return this.#state();
  }
  set state($$value) {
    return this.#state($$value);
  }
  constructor(props) {
    this.setOpen = props.setOpen;
    this.#isMobile = new IsMobile();
    this.props = props;
  }
  // Convenience getter for checking if the sidebar is mobile
  // without this, we would need to use `sidebar.isMobile.current` everywhere
  get isMobile() {
    return this.#isMobile.current;
  }
  // Event handler to apply to the `<svelte:window>`
  handleShortcutKeydown = (e) => {
    if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.toggle();
    }
  };
  setOpenMobile = (value) => {
    this.openMobile = value;
  };
  toggle = () => {
    return this.#isMobile.current ? this.openMobile = !this.openMobile : this.setOpen(!this.open);
  };
}
const SYMBOL_KEY = "scn-sidebar";
function setSidebar(props) {
  return setContext(Symbol.for(SYMBOL_KEY), new SidebarState(props));
}
function useSidebar() {
  return getContext(Symbol.for(SYMBOL_KEY));
}
function onDestroyEffect(fn) {
}
class GraceArea {
  #opts;
  #enabled;
  #isPointerInTransit;
  #pointerGraceArea = null;
  constructor(opts) {
    this.#opts = opts;
    this.#enabled = derived(() => this.#opts.enabled());
    this.#isPointerInTransit = boxAutoReset(false, {
      afterMs: opts.transitTimeout ?? 300,
      onChange: (value) => {
        if (!this.#enabled()) return;
        this.#opts.setIsPointerInTransit?.(value);
      },
      getWindow: () => getWindow(this.#opts.triggerNode())
    });
    watch([opts.triggerNode, opts.contentNode, opts.enabled], ([triggerNode, contentNode, enabled]) => {
      if (!triggerNode || !contentNode || !enabled) return;
      const handleTriggerLeave = (e) => {
        this.#createGraceArea(e, contentNode);
      };
      const handleContentLeave = (e) => {
        this.#createGraceArea(e, triggerNode);
      };
      return executeCallbacks(on(triggerNode, "pointerleave", handleTriggerLeave), on(contentNode, "pointerleave", handleContentLeave));
    });
    watch(() => this.#pointerGraceArea, () => {
      const handleTrackPointerGrace = (e) => {
        if (!this.#pointerGraceArea) return;
        const target = e.target;
        if (!isElement(target)) return;
        const pointerPosition = { x: e.clientX, y: e.clientY };
        const hasEnteredTarget = opts.triggerNode()?.contains(target) || opts.contentNode()?.contains(target);
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, this.#pointerGraceArea);
        if (hasEnteredTarget) {
          this.#removeGraceArea();
        } else if (isPointerOutsideGraceArea) {
          this.#removeGraceArea();
          opts.onPointerExit();
        }
      };
      const doc = getDocument(opts.triggerNode() ?? opts.contentNode());
      if (!doc) return;
      return on(doc, "pointermove", handleTrackPointerGrace);
    });
  }
  #removeGraceArea() {
    this.#pointerGraceArea = null;
    this.#isPointerInTransit.current = false;
  }
  #createGraceArea(e, hoverTarget) {
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(currentTarget)) return;
    const exitPoint = { x: e.clientX, y: e.clientY };
    const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
    const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
    const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
    const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
    this.#pointerGraceArea = graceArea;
    this.#isPointerInTransit.current = true;
  }
}
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const tipPadding = padding * 1.5;
  switch (exitSide) {
    case "top":
      return [
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x, y: exitPoint.y - tipPadding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      ];
    case "bottom":
      return [
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x, y: exitPoint.y + tipPadding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      ];
    case "left":
      return [
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x - tipPadding, y: exitPoint.y },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      ];
    case "right":
      return [
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + tipPadding, y: exitPoint.y },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      ];
  }
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
  else return upperHull.concat(lowerHull);
}
function Arrow($$payload, $$props) {
  push();
  let {
    id = useId(),
    children,
    child,
    width = 10,
    height = 5,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const mergedProps = mergeProps(restProps, { id });
  if (child) {
    $$payload.out.push("<!--[-->");
    child($$payload, { props: mergedProps });
    $$payload.out.push(`<!---->`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<span${spread_attributes({ ...mergedProps })}>`);
    if (children) {
      $$payload.out.push("<!--[-->");
      children?.($$payload);
      $$payload.out.push(`<!---->`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<svg${attr("width", width)}${attr("height", height)} viewBox="0 0 30 10" preserveAspectRatio="none" data-arrow=""><polygon points="0,0 30,0 15,10" fill="currentColor"></polygon></svg>`);
    }
    $$payload.out.push(`<!--]--></span>`);
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
function Floating_layer_arrow($$payload, $$props) {
  push();
  let { id = useId(), ref = null, $$slots, $$events, ...restProps } = $$props;
  const arrowState = FloatingArrowState.create({
    id: boxWith(() => id),
    ref: boxWith(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, arrowState.props);
  Arrow($$payload, spread_props([mergedProps]));
  bind_props($$props, { ref });
  pop();
}
class TimeoutFn {
  #interval;
  #cb;
  #timer = null;
  constructor(cb, interval) {
    this.#cb = cb;
    this.#interval = interval;
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    onDestroyEffect(this.stop);
  }
  #clear() {
    if (this.#timer !== null) {
      window.clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
  stop() {
    this.#clear();
  }
  start(...args) {
    this.#clear();
    this.#timer = window.setTimeout(() => {
      this.#timer = null;
      this.#cb(...args);
    }, this.#interval);
  }
}
const tooltipAttrs = createBitsAttrs({ component: "tooltip", parts: ["content", "trigger"] });
const TooltipProviderContext = new Context("Tooltip.Provider");
const TooltipRootContext = new Context("Tooltip.Root");
class TooltipProviderState {
  static create(opts) {
    return TooltipProviderContext.set(new TooltipProviderState(opts));
  }
  opts;
  isOpenDelayed = true;
  isPointerInTransit = simpleBox(false);
  #timerFn;
  #openTooltip = null;
  constructor(opts) {
    this.opts = opts;
    this.#timerFn = new TimeoutFn(
      () => {
        this.isOpenDelayed = true;
      },
      this.opts.skipDelayDuration.current
    );
  }
  #startTimer = () => {
    const skipDuration = this.opts.skipDelayDuration.current;
    if (skipDuration === 0) {
      return;
    } else {
      this.#timerFn.start();
    }
  };
  #clearTimer = () => {
    this.#timerFn.stop();
  };
  onOpen = (tooltip) => {
    if (this.#openTooltip && this.#openTooltip !== tooltip) {
      this.#openTooltip.handleClose();
    }
    this.#clearTimer();
    this.isOpenDelayed = false;
    this.#openTooltip = tooltip;
  };
  onClose = (tooltip) => {
    if (this.#openTooltip === tooltip) {
      this.#openTooltip = null;
    }
    this.#startTimer();
  };
  isTooltipOpen = (tooltip) => {
    return this.#openTooltip === tooltip;
  };
}
class TooltipRootState {
  static create(opts) {
    return TooltipRootContext.set(new TooltipRootState(opts, TooltipProviderContext.get()));
  }
  opts;
  provider;
  #delayDuration = derived(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
  get delayDuration() {
    return this.#delayDuration();
  }
  set delayDuration($$value) {
    return this.#delayDuration($$value);
  }
  #disableHoverableContent = derived(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
  get disableHoverableContent() {
    return this.#disableHoverableContent();
  }
  set disableHoverableContent($$value) {
    return this.#disableHoverableContent($$value);
  }
  #disableCloseOnTriggerClick = derived(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
  get disableCloseOnTriggerClick() {
    return this.#disableCloseOnTriggerClick();
  }
  set disableCloseOnTriggerClick($$value) {
    return this.#disableCloseOnTriggerClick($$value);
  }
  #disabled = derived(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
  get disabled() {
    return this.#disabled();
  }
  set disabled($$value) {
    return this.#disabled($$value);
  }
  #ignoreNonKeyboardFocus = derived(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
  get ignoreNonKeyboardFocus() {
    return this.#ignoreNonKeyboardFocus();
  }
  set ignoreNonKeyboardFocus($$value) {
    return this.#ignoreNonKeyboardFocus($$value);
  }
  contentNode = null;
  contentPresence;
  triggerNode = null;
  #wasOpenDelayed = false;
  #timerFn;
  #stateAttr = derived(() => {
    if (!this.opts.open.current) return "closed";
    return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
  });
  get stateAttr() {
    return this.#stateAttr();
  }
  set stateAttr($$value) {
    return this.#stateAttr($$value);
  }
  constructor(opts, provider) {
    this.opts = opts;
    this.provider = provider;
    this.#timerFn = new TimeoutFn(
      () => {
        this.#wasOpenDelayed = true;
        this.opts.open.current = true;
      },
      this.delayDuration ?? 0
    );
    this.contentPresence = new PresenceManager({
      open: this.opts.open,
      ref: boxWith(() => this.contentNode),
      onComplete: () => {
        this.opts.onOpenChangeComplete.current(this.opts.open.current);
      }
    });
    watch(() => this.delayDuration, () => {
      if (this.delayDuration === void 0) return;
      this.#timerFn = new TimeoutFn(
        () => {
          this.#wasOpenDelayed = true;
          this.opts.open.current = true;
        },
        this.delayDuration
      );
    });
    watch(
      () => this.opts.open.current,
      (isOpen) => {
        if (isOpen) {
          this.provider.onOpen(this);
        } else {
          this.provider.onClose(this);
        }
      },
      { lazy: true }
    );
  }
  handleOpen = () => {
    this.#timerFn.stop();
    this.#wasOpenDelayed = false;
    this.opts.open.current = true;
  };
  handleClose = () => {
    this.#timerFn.stop();
    this.opts.open.current = false;
  };
  #handleDelayedOpen = () => {
    this.#timerFn.stop();
    const shouldSkipDelay = !this.provider.isOpenDelayed;
    const delayDuration = this.delayDuration ?? 0;
    if (shouldSkipDelay || delayDuration === 0) {
      this.#wasOpenDelayed = delayDuration > 0 && shouldSkipDelay;
      this.opts.open.current = true;
    } else {
      this.#timerFn.start();
    }
  };
  onTriggerEnter = () => {
    this.#handleDelayedOpen();
  };
  onTriggerLeave = () => {
    if (this.disableHoverableContent) {
      this.handleClose();
    } else {
      this.#timerFn.stop();
    }
  };
}
class TooltipTriggerState {
  static create(opts) {
    return new TooltipTriggerState(opts, TooltipRootContext.get());
  }
  opts;
  root;
  attachment;
  #isPointerDown = simpleBox(false);
  #hasPointerMoveOpened = false;
  #isDisabled = derived(() => this.opts.disabled.current || this.root.disabled);
  domContext;
  #transitCheckTimeout = null;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.domContext = new DOMContext(opts.ref);
    this.attachment = attachRef(this.opts.ref, (v) => this.root.triggerNode = v);
  }
  #clearTransitCheck = () => {
    if (this.#transitCheckTimeout !== null) {
      clearTimeout(this.#transitCheckTimeout);
      this.#transitCheckTimeout = null;
    }
  };
  handlePointerUp = () => {
    this.#isPointerDown.current = false;
  };
  #onpointerup = () => {
    if (this.#isDisabled()) return;
    this.#isPointerDown.current = false;
  };
  #onpointerdown = () => {
    if (this.#isDisabled()) return;
    this.#isPointerDown.current = true;
    this.domContext.getDocument().addEventListener(
      "pointerup",
      () => {
        this.handlePointerUp();
      },
      { once: true }
    );
  };
  #onpointerenter = (e) => {
    if (this.#isDisabled()) return;
    if (e.pointerType === "touch") return;
    if (this.root.provider.isPointerInTransit.current) {
      this.#clearTransitCheck();
      this.#transitCheckTimeout = window.setTimeout(
        () => {
          if (this.root.provider.isPointerInTransit.current) {
            this.root.provider.isPointerInTransit.current = false;
            this.root.onTriggerEnter();
            this.#hasPointerMoveOpened = true;
          }
        },
        250
      );
      return;
    }
    this.root.onTriggerEnter();
    this.#hasPointerMoveOpened = true;
  };
  #onpointermove = (e) => {
    if (this.#isDisabled()) return;
    if (e.pointerType === "touch") return;
    if (this.#hasPointerMoveOpened) return;
    this.#clearTransitCheck();
    this.root.provider.isPointerInTransit.current = false;
    this.root.onTriggerEnter();
    this.#hasPointerMoveOpened = true;
  };
  #onpointerleave = () => {
    if (this.#isDisabled()) return;
    this.#clearTransitCheck();
    this.root.onTriggerLeave();
    this.#hasPointerMoveOpened = false;
  };
  #onfocus = (e) => {
    if (this.#isPointerDown.current || this.#isDisabled()) return;
    if (this.root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
    this.root.handleOpen();
  };
  #onblur = () => {
    if (this.#isDisabled()) return;
    this.root.handleClose();
  };
  #onclick = () => {
    if (this.root.disableCloseOnTriggerClick || this.#isDisabled()) return;
    this.root.handleClose();
  };
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-describedby": this.root.opts.open.current ? this.root.contentNode?.id : void 0,
    "data-state": this.root.stateAttr,
    "data-disabled": boolToEmptyStrOrUndef(this.#isDisabled()),
    "data-delay-duration": `${this.root.delayDuration}`,
    [tooltipAttrs.trigger]: "",
    tabindex: this.#isDisabled() ? void 0 : 0,
    disabled: this.opts.disabled.current,
    onpointerup: this.#onpointerup,
    onpointerdown: this.#onpointerdown,
    onpointerenter: this.#onpointerenter,
    onpointermove: this.#onpointermove,
    onpointerleave: this.#onpointerleave,
    onfocus: this.#onfocus,
    onblur: this.#onblur,
    onclick: this.#onclick,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class TooltipContentState {
  static create(opts) {
    return new TooltipContentState(opts, TooltipRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.contentNode = v);
    new GraceArea({
      triggerNode: () => this.root.triggerNode,
      contentNode: () => this.root.contentNode,
      enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
      onPointerExit: () => {
        if (this.root.provider.isTooltipOpen(this.root)) {
          this.root.handleClose();
        }
      },
      setIsPointerInTransit: (value) => {
        this.root.provider.isPointerInTransit.current = value;
      },
      transitTimeout: this.root.provider.opts.skipDelayDuration.current
    });
  }
  onInteractOutside = (e) => {
    if (isElement(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick) {
      e.preventDefault();
      return;
    }
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current?.(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onOpenAutoFocus = (e) => {
    e.preventDefault();
  };
  onCloseAutoFocus = (e) => {
    e.preventDefault();
  };
  get shouldRender() {
    return this.root.contentPresence.shouldRender;
  }
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "data-state": this.root.stateAttr,
    "data-disabled": boolToEmptyStrOrUndef(this.root.disabled),
    style: { pointerEvents: "auto", outline: "none" },
    [tooltipAttrs.content]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onOpenAutoFocus: this.onOpenAutoFocus,
    onCloseAutoFocus: this.onCloseAutoFocus
  };
}
function Tooltip$1($$payload, $$props) {
  push();
  let {
    open = false,
    onOpenChange = noop,
    onOpenChangeComplete = noop,
    disabled,
    delayDuration,
    disableCloseOnTriggerClick,
    disableHoverableContent,
    ignoreNonKeyboardFocus,
    children
  } = $$props;
  TooltipRootState.create({
    open: boxWith(() => open, (v) => {
      open = v;
      onOpenChange(v);
    }),
    delayDuration: boxWith(() => delayDuration),
    disableCloseOnTriggerClick: boxWith(() => disableCloseOnTriggerClick),
    disableHoverableContent: boxWith(() => disableHoverableContent),
    ignoreNonKeyboardFocus: boxWith(() => ignoreNonKeyboardFocus),
    disabled: boxWith(() => disabled),
    onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
  });
  Floating_layer($$payload, {
    tooltip: true,
    children: ($$payload2) => {
      children?.($$payload2);
      $$payload2.out.push(`<!---->`);
    }
  });
  bind_props($$props, { open });
  pop();
}
function Tooltip_content$1($$payload, $$props) {
  push();
  const uid = props_id($$payload);
  let {
    children,
    child,
    id = createId(uid),
    ref = null,
    side = "top",
    sideOffset = 0,
    align = "center",
    avoidCollisions = true,
    arrowPadding = 0,
    sticky = "partial",
    strategy,
    hideWhenDetached = false,
    collisionPadding = 0,
    onInteractOutside = noop,
    onEscapeKeydown = noop,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = TooltipContentState.create({
    id: boxWith(() => id),
    ref: boxWith(() => ref, (v) => ref = v),
    onInteractOutside: boxWith(() => onInteractOutside),
    onEscapeKeydown: boxWith(() => onEscapeKeydown)
  });
  const floatingProps = {
    side,
    sideOffset,
    align,
    avoidCollisions,
    arrowPadding,
    sticky,
    hideWhenDetached,
    collisionPadding,
    strategy
  };
  const mergedProps = mergeProps(restProps, floatingProps, contentState.props);
  if (forceMount) {
    $$payload.out.push("<!--[-->");
    {
      let popper = function($$payload2, { props, wrapperProps }) {
        const mergedProps2 = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") });
        if (child) {
          $$payload2.out.push("<!--[-->");
          child($$payload2, {
            props: mergedProps2,
            wrapperProps,
            ...contentState.snippetProps
          });
          $$payload2.out.push(`<!---->`);
        } else {
          $$payload2.out.push("<!--[!-->");
          $$payload2.out.push(`<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...mergedProps2 })}>`);
          children?.($$payload2);
          $$payload2.out.push(`<!----></div></div>`);
        }
        $$payload2.out.push(`<!--]-->`);
      };
      Popper_layer_force_mount($$payload, spread_props([
        mergedProps,
        contentState.popperProps,
        {
          enabled: contentState.root.opts.open.current,
          id,
          trapFocus: false,
          loop: false,
          preventScroll: false,
          forceMount: true,
          ref: contentState.opts.ref,
          tooltip: true,
          shouldRender: contentState.shouldRender,
          popper,
          $$slots: { popper: true }
        }
      ]));
    }
  } else {
    $$payload.out.push("<!--[!-->");
    if (!forceMount) {
      $$payload.out.push("<!--[-->");
      {
        let popper = function($$payload2, { props, wrapperProps }) {
          const mergedProps2 = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") });
          if (child) {
            $$payload2.out.push("<!--[-->");
            child($$payload2, {
              props: mergedProps2,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$payload2.out.push(`<!---->`);
          } else {
            $$payload2.out.push("<!--[!-->");
            $$payload2.out.push(`<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...mergedProps2 })}>`);
            children?.($$payload2);
            $$payload2.out.push(`<!----></div></div>`);
          }
          $$payload2.out.push(`<!--]-->`);
        };
        Popper_layer($$payload, spread_props([
          mergedProps,
          contentState.popperProps,
          {
            open: contentState.root.opts.open.current,
            id,
            trapFocus: false,
            loop: false,
            preventScroll: false,
            forceMount: false,
            ref: contentState.opts.ref,
            tooltip: true,
            shouldRender: contentState.shouldRender,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { ref });
  pop();
}
function Tooltip_trigger$1($$payload, $$props) {
  push();
  const uid = props_id($$payload);
  let {
    children,
    child,
    id = createId(uid),
    disabled = false,
    type = "button",
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = TooltipTriggerState.create({
    id: boxWith(() => id),
    disabled: boxWith(() => disabled ?? false),
    ref: boxWith(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, triggerState.props, { type });
  Floating_layer_anchor($$payload, {
    id,
    ref: triggerState.opts.ref,
    tooltip: true,
    children: ($$payload2) => {
      if (child) {
        $$payload2.out.push("<!--[-->");
        child($$payload2, { props: mergedProps });
        $$payload2.out.push(`<!---->`);
      } else {
        $$payload2.out.push("<!--[!-->");
        $$payload2.out.push(`<button${spread_attributes({ ...mergedProps })}>`);
        children?.($$payload2);
        $$payload2.out.push(`<!----></button>`);
      }
      $$payload2.out.push(`<!--]-->`);
    }
  });
  bind_props($$props, { ref });
  pop();
}
function Tooltip_arrow($$payload, $$props) {
  push();
  let { ref = null, $$slots, $$events, ...restProps } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Floating_layer_arrow($$payload2, spread_props([
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Tooltip($$payload, $$props) {
  push();
  let { open = false, $$slots, $$events, ...restProps } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Tooltip$1($$payload2, spread_props([
      restProps,
      {
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out.push(`<!---->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { open });
  pop();
}
function Tooltip_trigger($$payload, $$props) {
  push();
  let { ref = null, $$slots, $$events, ...restProps } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Tooltip_trigger$1($$payload2, spread_props([
      { "data-slot": "tooltip-trigger" },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out.push(`<!---->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Tooltip_portal($$payload, $$props) {
  let { $$slots, $$events, ...restProps } = $$props;
  $$payload.out.push(`<!---->`);
  Portal($$payload, spread_props([restProps]));
  $$payload.out.push(`<!---->`);
}
function Tooltip_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    sideOffset = 0,
    side = "top",
    children,
    arrowClasses,
    portalProps,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Tooltip_portal($$payload2, spread_props([
      portalProps,
      {
        children: ($$payload3) => {
          $$payload3.out.push(`<!---->`);
          Tooltip_content$1($$payload3, spread_props([
            {
              "data-slot": "tooltip-content",
              sideOffset,
              side,
              class: cn("bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--bits-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className)
            },
            restProps,
            {
              get ref() {
                return ref;
              },
              set ref($$value) {
                ref = $$value;
                $$settled = false;
              },
              children: ($$payload4) => {
                children?.($$payload4);
                $$payload4.out.push(`<!----> <!---->`);
                {
                  let child = function($$payload5, { props }) {
                    $$payload5.out.push(`<div${spread_attributes(
                      {
                        class: clsx(cn("bg-foreground z-50 size-2.5 rotate-45 rounded-[2px]", "data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%_+_2px)]", "data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%_+_1px)]", "data-[side=right]:translate-x-[calc(50%_+_2px)] data-[side=right]:translate-y-1/2", "data-[side=left]:-translate-y-[calc(50%_-_3px)]", arrowClasses)),
                        ...props
                      }
                    )}></div>`);
                  };
                  Tooltip_arrow($$payload4, { child, $$slots: { child: true } });
                }
                $$payload4.out.push(`<!---->`);
              },
              $$slots: { default: true }
            }
          ]));
          $$payload3.out.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
const sidebarMenuButtonVariants = tv({
  base: "peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline: "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_var(--sidebar-border)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});
function Sidebar_menu_button($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    child,
    variant = "default",
    size = "default",
    isActive = false,
    tooltipContent,
    tooltipContentProps,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const sidebar = useSidebar();
  const buttonProps = {
    class: cn(sidebarMenuButtonVariants({ variant, size }), className),
    "data-slot": "sidebar-menu-button",
    "data-sidebar": "menu-button",
    "data-size": size,
    "data-active": isActive,
    ...restProps
  };
  function Button($$payload2, { props }) {
    const mergedProps = mergeProps(buttonProps, props);
    if (child) {
      $$payload2.out.push("<!--[-->");
      child($$payload2, { props: mergedProps });
      $$payload2.out.push(`<!---->`);
    } else {
      $$payload2.out.push("<!--[!-->");
      $$payload2.out.push(`<button${spread_attributes({ ...mergedProps })}>`);
      children?.($$payload2);
      $$payload2.out.push(`<!----></button>`);
    }
    $$payload2.out.push(`<!--]-->`);
  }
  if (!tooltipContent) {
    $$payload.out.push("<!--[-->");
    Button($$payload, {});
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<!---->`);
    Tooltip($$payload, {
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        {
          let child2 = function($$payload3, { props }) {
            Button($$payload3, { props });
          };
          Tooltip_trigger($$payload2, { child: child2, $$slots: { child: true } });
        }
        $$payload2.out.push(`<!----> <!---->`);
        Tooltip_content($$payload2, spread_props([
          {
            side: "right",
            align: "center",
            hidden: sidebar.state !== "collapsed" || sidebar.isMobile
          },
          tooltipContentProps,
          {
            children: ($$payload3) => {
              if (typeof tooltipContent === "string") {
                $$payload3.out.push("<!--[-->");
                $$payload3.out.push(`${escape_html(tooltipContent)}`);
              } else {
                $$payload3.out.push("<!--[!-->");
                if (tooltipContent) {
                  $$payload3.out.push("<!--[-->");
                  tooltipContent($$payload3);
                  $$payload3.out.push(`<!---->`);
                } else {
                  $$payload3.out.push("<!--[!-->");
                }
                $$payload3.out.push(`<!--]-->`);
              }
              $$payload3.out.push(`<!--]-->`);
            },
            $$slots: { default: true }
          }
        ]));
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    });
    $$payload.out.push(`<!---->`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { ref });
  pop();
}
function Sheet_portal($$payload, $$props) {
  let { $$slots, $$events, ...restProps } = $$props;
  $$payload.out.push(`<!---->`);
  Portal($$payload, spread_props([restProps]));
  $$payload.out.push(`<!---->`);
}
function Sheet_overlay($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Dialog_overlay($$payload2, spread_props([
      {
        "data-slot": "sheet-overlay",
        class: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out.push(`<!---->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
const sheetVariants = tv({
  base: "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  variants: {
    side: {
      top: "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
      bottom: "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
      left: "data-[state=closed]:slide-out-to-start data-[state=open]:slide-in-from-start inset-y-0 start-0 h-full w-3/4 border-e sm:max-w-sm",
      right: "data-[state=closed]:slide-out-to-end data-[state=open]:slide-in-from-end inset-y-0 end-0 h-full w-3/4 border-s sm:max-w-sm"
    }
  },
  defaultVariants: { side: "right" }
});
function Sheet_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    side = "right",
    portalProps,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Sheet_portal($$payload2, spread_props([
      portalProps,
      {
        children: ($$payload3) => {
          Sheet_overlay($$payload3, {});
          $$payload3.out.push(`<!----> <!---->`);
          Dialog_content($$payload3, spread_props([
            {
              "data-slot": "sheet-content",
              class: cn(sheetVariants({ side }), className)
            },
            restProps,
            {
              get ref() {
                return ref;
              },
              set ref($$value) {
                ref = $$value;
                $$settled = false;
              },
              children: ($$payload4) => {
                children?.($$payload4);
                $$payload4.out.push(`<!----> <!---->`);
                Dialog_close($$payload4, {
                  class: "ring-offset-background focus-visible:ring-ring absolute end-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none",
                  children: ($$payload5) => {
                    X($$payload5, { class: "size-4" });
                    $$payload5.out.push(`<!----> <span class="sr-only">Close</span>`);
                  },
                  $$slots: { default: true }
                });
                $$payload4.out.push(`<!---->`);
              },
              $$slots: { default: true }
            }
          ]));
          $$payload3.out.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}

export { SIDEBAR_COOKIE_NAME as S, TooltipProviderState as T, SIDEBAR_COOKIE_MAX_AGE as a, SIDEBAR_WIDTH as b, SIDEBAR_WIDTH_ICON as c, Sheet_content as d, SIDEBAR_WIDTH_MOBILE as e, Sidebar_menu_button as f, setSidebar as s, useSidebar as u };
//# sourceMappingURL=sheet-content-Pn2foTu1.js.map
