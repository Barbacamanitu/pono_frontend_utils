var _a;
import { immerable } from "immer";
export class Template {
    constructor(init) {
        this[_a] = true;
        Object.assign(this, init);
    }
    static default() {
        return new Template({
            name: "Template name",
            uuid: "uuid",
            description: "Template description",
            input_sections: [],
            output_sections: [],
            created_by: "Creator",
            pushed_to_sibyl: false
        });
    }
    static defaultFlow() {
        return new Template({
            name: "Flow Name",
            uuid: "uuid",
            description: "Flow Description",
            input_sections: [],
            output_sections: [],
            created_by: "Creator",
            pushed_to_sibyl: false
        });
    }
}
_a = immerable;
