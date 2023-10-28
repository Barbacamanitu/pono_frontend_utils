import { immerable } from "immer";
export declare class Template {
    [immerable]: boolean;
    uuid: string;
    name: string;
    pushed_to_sibyl: boolean;
    description: string;
    input_sections: Array<InputSection>;
    output_sections: Array<OutputSection>;
    created_by: string;
    constructor(init?: Partial<Template>);
    static default(): Template;
    static defaultFlow(): Template;
}
export type InputSection = {
    uuid: string;
    name: string;
    fields: Array<InputField>;
};
export type InputField = {
    uuid: string;
    name: string;
    data_type: string;
    help_text: string;
    sample_input: string;
};
export type OutputSection = {
    uuid: string;
    name: string;
    fields: Array<OutputField>;
};
export type OutputField = {
    uuid: string;
    name: string;
    data_type: string;
    generation_prompt: string;
    model: string;
    temperature: number;
    system_prompt: string;
    max_tokens: number;
};
