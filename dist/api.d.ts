import { Template } from "./Template";
export type ApiError = {
    status: number;
    error_message: string;
};
export declare class API {
    api_url: string;
    constructor(url: string);
    parseResponse(response: Response): Promise<any | ApiError>;
    postData(url: string, data: any): Promise<any>;
    postDataWithAccessToken(url: string, data: {}, access_token: string): Promise<any | ApiError>;
    APILogin(username: string, password: string): Promise<any>;
    CreateTemplate(name: string, description: string): Promise<any>;
    SearchTemplates(search: string): Promise<any>;
    SearchTemplatesByUser(search: string): Promise<any>;
    DeleteTemplate(uuid: string): Promise<any>;
    CloneTemplate(uuid: string): Promise<any>;
    TokenRefresh(): Promise<any>;
    GetTemplate(uuid: string): Promise<any>;
    SaveTemplate(template: Template): Promise<any>;
    PushToSibyl(template: Template): Promise<any>;
    GenerateSampleOutput(prompt: string, temperature: number, max_tokens: number, model: string, system_prompt: string): Promise<any>;
}
