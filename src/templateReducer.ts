import { v4 as uuid4 } from "uuid";
import { InputField, InputSection, OutputField, OutputSection, Template } from "./Template";

export type TemplateAction = {
    type: string,
    field_uuid?: string,
    section_uuid?: string,
    isInput?: boolean,
    temperature?: number,
    system_prompt?: string,
    max_tokens?: number,
    model?: string,
    description?: string,
    name?: string,
    input?: string,
    generation_prompt?: string,
    data_type?: string,
    template?: Template,
    help_text?: string,
    insert_after?: number
}

function arrayMove<T>(array:Array<T>, from: number,to: number) {
    array.splice(to,0,array.splice(from,1)[0])
}
export function TemplateReduce(draft:Template,action: TemplateAction) {
    switch (action.type) {
        case "add_input_section": {
            const newId = uuid4();
            const newSection = {
                name: "New Input Section",
                uuid: newId ,
                fields: [],
            };
            draft.input_sections.push(newSection);
            return draft;
        }
        case "add_output_section": {
            const newId = uuid4();
            const newSection = {
                name: "New Output Section",
                uuid: newId ,
                fields: [],
            };
            draft.output_sections.push(newSection);
            return draft;
        }
        case "add_field": {
            return addField(draft, action);
            
        }
        case "move_section_up": {
            return moveSectionUp(draft,action);
        }
        case "move_section_down": {
            return moveSectionDown(draft,action);
        }
        case "delete_section": {
            return deleteSection(draft,action);
        }
        case "set_section_name": {
            return setSectionName(draft,action);
        }
        case "delete_field": {
            return deleteField(draft,action);
        }
        case "set_data_type": {
            return setDataType(draft,action);
        }
        case "set_generation_prompt": {
            return setGenerationPrompt(draft, action);
        }
        case "set_field_name": {
            return setFieldName(draft, action);
        }
        case "set_help_text": {
            return setHelpText(draft,action);
        }
        case "set_sample_input": {
            return setSampleInput(draft, action);
        }
        case "set_template_name": {
            return setTemplateName(draft, action);
        }
        case "set_template_description": {
            return setTemplateDescription(draft, action);
        }
        case "set_temperature": {
            return setTemperature(draft, action);
        }
        case "set_max_tokens": {
            return setMaxTokens(draft, action);
        }
        case "set_model": {
            return setModel(draft,action);
        }
        case "set_system_prompt":
            return setSystemPrompt(draft,action);
        case "move_field_up":
            return moveFieldUp(draft,action);
        case "move_field_down":
            return moveFieldDown(draft,action);
        case "set_template":
            return setTemplate(draft,action);
        case "insert_input_field_after_index":
            return insertInputFieldAfter(draft,action);
    }
}



function insertInputFieldAfter(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == undefined) {
        console.error("Insert Field After. Missing uuid");
        return draft;
    }
    if (typeof action.insert_after == undefined) {
        console.error("Insert Field After. Missing index");
        return draft;
    }

    const sectionAndIndex = getFieldSectionAndIndex(draft,action.field_uuid);
    if (!sectionAndIndex) {
        console.error("Insert Fied After. Couldnt find field");
        return draft;
    }


    const newField :InputField = {
        uuid: uuid4(),
        name: "New Field",
        data_type: "Plain_Text",
        help_text: "Help Text",
        sample_input: ""
    };

    //console.log(sectionAndIndex.section);

    sectionAndIndex.section.fields.splice(sectionAndIndex.index+1,0,newField);
    return draft;


}

function setTemplate(draft: Template, action: TemplateAction) {
    if (typeof action.template == "undefined") {
        console.log("Couldn't set template!");
        return draft;
    }
    draft.created_by = action.template.created_by;
    draft.description = action.template.description;
    draft.input_sections = action.template.input_sections;
    draft.name = action.template.name;
    draft.output_sections = action.template.output_sections;
    draft.pushed_to_sibyl = action.template.pushed_to_sibyl;
    draft.uuid = action.template.uuid;

    return draft;
}

function setSystemPrompt(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    const field = getField(draft, action.field_uuid) as OutputField;
    if (typeof action.system_prompt != 'undefined'){
        field.system_prompt = action.system_prompt;
    }
    return draft;
}

function setModel(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    const field = getField(draft,action.field_uuid) as OutputField;
    if (typeof action.model != 'undefined') {
        field.model = action.model;
    }
    return draft;
}

function setMaxTokens(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    const field = getField(draft, action.field_uuid) as OutputField;
    if (typeof action.max_tokens == 'undefined') {
        return draft;
    }
    field.max_tokens = action.max_tokens;
    return draft;
}

function setTemperature(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    if (typeof action.temperature == 'undefined') {
        return draft;
    }
    const field = getField(draft,action.field_uuid);
    if (field == null) {
        return draft;
    }
    const theField = field as OutputField;

    theField.temperature = action.temperature;
    return draft;

}
function setTemplateDescription(draft: Template, action: TemplateAction) {
    if (typeof action.description == 'undefined') {
        return draft;
    }
    draft.description = action.description;
    return draft;
}

function setTemplateName(draft: Template, action: TemplateAction) {
    if (typeof action.name == 'undefined') {
        return draft;
    }
    draft.name = action.name;
    return draft;
}


function setSampleInput(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    const field = getField(draft,action.field_uuid) as InputField;
    if (typeof action.input == 'undefined') {
        return draft;
    }
    field.sample_input = action.input;
    return draft;
}

function setFieldName(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    if (typeof action.name == 'undefined') {
        return draft;
    }
    const field = getField(draft, action.field_uuid);
    if (!field) {
        console.error("Error setting field name. Couldn't find field.");
        return draft;
    }
    
    field.name = action.name;
    return draft;
}

function setHelpText(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    if (typeof action.help_text == 'undefined') {
        return draft;
    }
    const field = getField(draft, action.field_uuid) as InputField;
    if (!field) {
        console.error("Error setting field name. Couldn't find field.");
        return draft;
    }
    
    field.help_text = action.help_text;
    return draft;
}

function setGenerationPrompt(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    if (typeof action.generation_prompt == 'undefined') {
        return draft;
    }
    const field = getField(draft,action.field_uuid) as OutputField;
    if (!field) {
        console.error("Error setting generation prompt. Couldn't find field");
        return draft;
    }
    field.generation_prompt = action.generation_prompt;
    return draft;

}


function addField(draft: Template, action: TemplateAction) {
    const sections = (action.isInput) ? draft.input_sections : draft.output_sections;
            const newId = uuid4();
            const thisSection = sections.find((section:InputSection | OutputSection) => section.uuid === action.section_uuid);
            if (thisSection === undefined || thisSection == null) {
                return draft;
            }
            
            if (action.isInput) {
                const newField :InputField = {
                    uuid: newId,
                    name: "New Field",
                    data_type: "Plain_Text",
                    help_text: "Help Text",
                    sample_input: ""
                };
                const iSection = thisSection as InputSection;
                iSection.fields.push(newField);
            } else {
                const newField :OutputField = {
                    uuid: newId,
                    name: "New Field",
                    data_type: "Plain_Text",
                    generation_prompt: "Generation Prompt",
                    model: "gpt-3.5-turbo-instruct",
                    temperature: 0.2,
                    system_prompt: "You are a helpful assistant",
                    max_tokens: 250
                };
                const oSection = thisSection as OutputSection;
                oSection.fields.push(newField);
            }
            return draft;
}


function setDataType(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    if (typeof action.data_type == 'undefined') {
        return draft;
    }
    const field = getField(draft,action.field_uuid);
    if (!field) {
        console.error("Error setting data type. Couldn't get field.");
        return draft;
    }
    field.data_type = action.data_type;
    return draft;
}

function deleteField(draft: Template, action: TemplateAction) {
    if (typeof action.section_uuid == 'undefined') {
        return draft;
    }
    const thisSection = getSection(draft,action.section_uuid);
    if (!thisSection) {
        console.error("Error deleting field. Couldn't find section");
        return draft;
    }

    const fields = thisSection.fields;
    const fieldIndex = fields.findIndex((field:InputField | OutputField) => field.uuid === action.field_uuid);
    if (fieldIndex < 0) {
        console.error("Error deleting field. Couldn't find field index.");
        return draft;
    }

    fields.splice(fieldIndex,1);
    return draft;
}

function setSectionName(draft: Template, action: TemplateAction) {
    if (typeof action.section_uuid == 'undefined') {
        return draft;
    }
    if (typeof action.name == 'undefined') {
        return draft;
    }
    const thisSection = getSection(draft,action.section_uuid);
    if (!thisSection) {
        console.error("Couldn't set section name. Section not found.");
        return draft;
    }
    thisSection.name = action.name;
    return draft;
}



function deleteSection(draft: Template, action: TemplateAction) {
    const sections = (action.isInput) ? draft.input_sections : draft.output_sections;
    const thisSectionIndex = sections.findIndex((section:InputSection | OutputSection) => section.uuid == action.section_uuid);
    if (thisSectionIndex == -1) {
        console.error("Error Deleting Section. Couldnt find Section");
        return draft;
    }
    sections.splice(thisSectionIndex,1);
    return draft;
}

function moveSectionUp(draft: Template, action: TemplateAction) {
    const sections = (action.isInput) ? draft.input_sections : draft.output_sections;
    const thisIndex = sections.findIndex((section:InputSection | OutputSection) => section.uuid === action.section_uuid);
    if (thisIndex < 0) {
        //Section not found.
        console.error("Error moving section up. Couldn't find section index.");
        return draft;
    }
    //Index needs to be set to itself -1.
    //Make sure current index isn't 0.
    if (thisIndex < 1) {
        console.error("Couldn't move section up. Already in first position.");
        return draft;
    }
    arrayMove<InputSection | OutputSection>(sections,thisIndex,thisIndex-1);
    return draft;
}

type SectionAndIndex = {
    section: InputSection | OutputSection,
    index: number
};

function getFieldSectionAndIndex(draft: Template,field_uuid:string):SectionAndIndex|null {
    const input_sections = draft.input_sections;
    const output_sections = draft.output_sections;
    const all_sections = [...input_sections,...output_sections];
    for (let i = 0; i < all_sections.length; i++) {
        const theField = all_sections[i].fields.findIndex((field:InputField | OutputField) => field.uuid === field_uuid);
        if (theField > -1) {
            return {
                section: all_sections[i],
                index: theField
            };
        }
    }
    return null;
}

function moveFieldUp(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    const sectionAndIndex = getFieldSectionAndIndex(draft,action.field_uuid);
    if (!sectionAndIndex) {
        console.error("Couldnt find field");
        return draft;
    }
    const section = sectionAndIndex.section;
    const index = sectionAndIndex.index;

    if (index < 1) {
        console.log("Couldn't move field up. already at 0");
        return draft;
    }
    
    arrayMove<InputField|OutputField>(section.fields,index,index-1);
    return draft;
}

function moveFieldDown(draft: Template, action: TemplateAction) {
    if (typeof action.field_uuid == 'undefined') {
        return draft;
    }
    const sectionAndIndex = getFieldSectionAndIndex(draft,action.field_uuid);
    if (!sectionAndIndex) {
        console.error("Couldnt find field");
        return draft;
    }
    const section = sectionAndIndex.section;
    const index = sectionAndIndex.index;

    if (index > section.fields.length - 2) {
        console.log("Couldn't move field down. already at lsat position");
        return draft;
    }
    
    arrayMove<InputField|OutputField>(section.fields,index,index-1);
    return draft;
}

function moveSectionDown(draft: Template,action: TemplateAction) {
    const sections = (action.isInput) ? draft.input_sections : draft.output_sections;
    const thisIndex = sections.findIndex((section:InputSection | OutputSection) => section.uuid === action.section_uuid);
    if (thisIndex < 0) {
        //Section not found.
        console.error("Error moving section up. Couldn't find section index.");
        return draft;
    }
    //Index needs to be set to itself +1.
    //Make sure current index isnt too high.
    if (thisIndex > (sections.length - 2)) {
        console.error("Couldn't move section down. Already in last position.");
        return draft;
    }
    arrayMove<InputSection|OutputSection>(sections,thisIndex,thisIndex+1);
    return draft;
}

function getSection(draft: Template, section_uuid:string) {
    const sections = [...draft.input_sections,...draft.output_sections];
    return sections.find((section:InputSection | OutputSection) => section.uuid === section_uuid);
}

function getField(draft: Template, field_uuid:string) : InputField | OutputField | null{
    const input_sections = draft.input_sections;
    const output_sections = draft.output_sections;
    const all_sections = [...input_sections, ...output_sections];
    for (let i = 0; i < all_sections.length; i++) {
        const theField = all_sections[i].fields.find((field:InputField | OutputField) => field.uuid === field_uuid);
        if (theField) {
            return theField;
        }
    }
    return null;
}