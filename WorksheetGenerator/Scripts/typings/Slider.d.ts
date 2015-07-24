interface SliderOptions {
    min?: number;
    max?: number;
    scale?: string;
    step?: number;
    range?: boolean;
    value?: number[]| number;
}

interface JQuery {
    slider(options: SliderOptions) : any
}