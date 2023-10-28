import {immerable} from "immer"


export class Template {
    [immerable] = true;
    public uuid: string;
    public name: string;
    public pushed_to_sibyl: boolean;
    public description: string;
    public input_sections: Array<InputSection>;
    public output_sections: Array<OutputSection>;
    public created_by: string;

    public constructor(init?:Partial<Template>) {
        Object.assign(this, init);
    }

    public static default() : Template {
        return new Template(
            {
                name: "Template name",
                uuid: "uuid",
                description: "Template description",
                input_sections: [],
                output_sections: [],
                created_by: "Creator",
                pushed_to_sibyl: false
            }
        );
    }

    public static defaultFlow() : Template {
        return new Template(
            {
                name: "Flow Name",
                uuid: "uuid",
                description: "Flow Description",
                input_sections: [],
                output_sections: [],
                created_by: "Creator",
                pushed_to_sibyl: false
            }
        );
    }
}

export type InputSection = {
    uuid: string,
    name: string,
    fields: Array<InputField>
}

export type InputField = {
    uuid: string,
    name: string,
    data_type: string,
    help_text: string,
    sample_input: string
}

export type OutputSection = {
    uuid: string,
    name: string,
    fields: Array<OutputField>
}

export type OutputField = {
    uuid: string,
    name: string,
    data_type: string,
    generation_prompt: string,
    model: string,
    temperature: number,
    system_prompt: string,
    max_tokens: number

}