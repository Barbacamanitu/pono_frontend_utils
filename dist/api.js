import { LoginUtil } from "./login_util";
export class API {
    constructor(url) {
        this.api_url = url;
    }
    async parseResponse(response) {
        const api_error = {
            status: response.status,
            error_message: "Unknown Error"
        };
        try {
            let response_json = await response.json();
            //Correctly parsed response as json. Check if status code is correct. Throw if not.
            if (response.ok) {
                return response_json;
            }
            else {
                //Response is valid json, yet doesn't have a 200 status code. This is an ApiError
                if (response_json.error_message) {
                    //Has proper structure to be an ApiError
                    api_error.error_message = response_json.error_message;
                    return Promise.reject(api_error);
                }
                else {
                    //Response has invalid structure to be a proper ApiError. Throw custom apierror
                    api_error.error_message = "Unknown API Error.";
                    return Promise.reject(api_error);
                }
            }
            return response_json;
        }
        catch (err) {
            if (response.status == 404) {
                api_error.error_message = "API Route not found";
            }
            else {
                api_error.error_message = "Unable to parse response as JSON.";
            }
            return Promise.reject(api_error);
        }
    }
    async postData(url = "", data) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return this.parseResponse(response);
    }
    async postDataWithAccessToken(url = "", data = {}, access_token) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return this.parseResponse(response);
    }
    async APILogin(username, password) {
        return await this.postData(this.api_url + "login", { username: username, password: password });
    }
    async CreateTemplate(name, description) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        const create_template_req = { template_name: name, template_description: description, save: true };
        return await this.postDataWithAccessToken(this.api_url + "create_template", create_template_req, access_token);
    }
    async SearchTemplates(search) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        return await this.postDataWithAccessToken(this.api_url + "search_templates", { query: search }, access_token);
    }
    async SearchTemplatesByUser(search) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        return await this.postDataWithAccessToken(this.api_url + "search_templates_by_user", { query: search }, access_token);
    }
    async DeleteTemplate(uuid) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        return await this.postDataWithAccessToken(this.api_url + "delete_template", { uuid: uuid }, access_token);
    }
    async CloneTemplate(uuid) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        return await this.postDataWithAccessToken(this.api_url + "clone_template", { uuid: uuid }, access_token);
    }
    async TokenRefresh() {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        const refresh_token = validated_creds.refresh_token;
        return await this.postDataWithAccessToken(this.api_url + "refresh_token", { refresh_token: refresh_token }, access_token);
    }
    async GetTemplate(uuid) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        return await this.postDataWithAccessToken(this.api_url + "get_template", { uuid: uuid }, access_token);
    }
    async SaveTemplate(template) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        return await this.postDataWithAccessToken(this.api_url + "edit_template", { template: template }, access_token);
    }
    async PushToSibyl(template) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        return await this.postDataWithAccessToken(this.api_url + "push_to_sibyl", { uuid: template.uuid }, access_token);
    }
    async GenerateSampleOutput(prompt, temperature, max_tokens, model, system_prompt) {
        const validated_creds = LoginUtil.getValidatedCredsFromLocal();
        const access_token = validated_creds.access_token;
        let temp = temperature;
        let request = { prompt: prompt, temperature: temp, max_tokens: max_tokens, model: model, system_prompt: system_prompt };
        return await this.postDataWithAccessToken(this.api_url + "sample_generation", request, access_token);
    }
}
