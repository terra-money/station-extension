/// <reference types="react" />
import { AnimationDirection, AnimationSegment, AnimationItem, RendererType, AnimationConfigWithData, AnimationEventName } from 'lottie-web';
export { default as LottiePlayer } from 'lottie-web';
import * as react from 'react';
import react__default, { RefObject, MutableRefObject, AnimationEventHandler, ReactElement, CSSProperties } from 'react';

type LottieRefCurrentProps = {
    play: () => void;
    stop: () => void;
    pause: () => void;
    setSpeed: (speed: number) => void;
    goToAndStop: (value: number, isFrame?: boolean) => void;
    goToAndPlay: (value: number, isFrame?: boolean) => void;
    setDirection: (direction: AnimationDirection) => void;
    playSegments: (segments: AnimationSegment | AnimationSegment[], forceFlag?: boolean) => void;
    setSubframe: (useSubFrames: boolean) => void;
    getDuration: (inFrames?: boolean) => number | undefined;
    destroy: () => void;
    animationContainerRef: RefObject<HTMLDivElement>;
    animationLoaded: boolean;
    animationItem: AnimationItem | undefined;
};
type LottieRef = MutableRefObject<LottieRefCurrentProps | null>;
type LottieOptions<T extends RendererType = "svg"> = Omit<AnimationConfigWithData<T>, "container" | "animationData"> & {
    animationData: unknown;
    lottieRef?: LottieRef;
    onComplete?: AnimationEventHandler | null;
    onLoopComplete?: AnimationEventHandler | null;
    onEnterFrame?: AnimationEventHandler | null;
    onSegmentStart?: AnimationEventHandler | null;
    onConfigReady?: AnimationEventHandler | null;
    onDataReady?: AnimationEventHandler | null;
    onDataFailed?: AnimationEventHandler | null;
    onLoadedImages?: AnimationEventHandler | null;
    onDOMLoaded?: AnimationEventHandler | null;
    onDestroy?: AnimationEventHandler | null;
} & Omit<react__default.HTMLProps<HTMLDivElement>, "loop">;
type PartialLottieOptions = Omit<LottieOptions, "animationData"> & {
    animationData?: LottieOptions["animationData"];
};
type Axis = "x" | "y";
type Position = {
    [key in Axis]: number | [number, number];
};
type Action = {
    type: "seek" | "play" | "stop" | "loop";
    frames: [number] | [number, number];
    visibility?: [number, number];
    position?: Position;
};
type InteractivityProps = {
    lottieObj: {
        View: ReactElement;
    } & LottieRefCurrentProps;
    actions: Action[];
    mode: "scroll" | "cursor";
};
type LottieComponentProps = LottieOptions & {
    interactivity?: Omit<InteractivityProps, "lottieObj">;
};
type PartialLottieComponentProps = Omit<LottieComponentProps, "animationData"> & {
    animationData?: LottieOptions["animationData"];
};
type Listener = {
    name: AnimationEventName;
    handler: AnimationEventHandler;
};
type PartialListener = Omit<Listener, "handler"> & {
    handler?: Listener["handler"] | null;
};

declare const Lottie: (props: LottieComponentProps) => react.ReactElement<any, string | react.JSXElementConstructor<any>>;

declare const useLottie: <T extends RendererType = "svg">(props: LottieOptions<T>, style?: CSSProperties) => {
    View: ReactElement;
} & LottieRefCurrentProps;

declare const useLottieInteractivity: ({ actions, mode, lottieObj, }: InteractivityProps) => ReactElement;

export { Action, Axis, InteractivityProps, Listener, LottieComponentProps, LottieOptions, LottieRef, LottieRefCurrentProps, PartialListener, PartialLottieComponentProps, PartialLottieOptions, Position, Lottie as default, useLottie, useLottieInteractivity };
