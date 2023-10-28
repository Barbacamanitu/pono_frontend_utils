import { Template } from "./Template";
import { LoginUtil } from "./login_util";



export type ApiError = {
  status: number,
  error_message: string
}


export class API {
  api_url: string;

  constructor(url: string) {
    this.api_url = url;
  }
  
  async parseResponse(response: Response) : Promise<any|ApiError> {

    const api_error : ApiError = {
      status: response.status,
      error_message: "Unknown Error"
    };
  
    try {
      let response_json = await response.json();
      //Correctly parsed response as json. Check if status code is correct. Throw if not.
      if (response.ok) {
        return response_json;
      } else {
        //Response is valid json, yet doesn't have a 200 status code. This is an ApiError
        if (response_json.error_message) {
          //Has proper structure to be an ApiError
          api_error.error_message = response_json.error_message;
          return Promise.reject(api_error);
        } else {
          //Response has invalid structure to be a proper ApiError. Throw custom apierror
          api_error.error_message = "Unknown API Error.";
          return Promise.reject(api_error);
        }
      }
      return response_json;
    } catch (err) {
      if (response.status == 404) {
        api_error.error_message = "API Route not found";
      } else {
        api_error.error_message = "Unable to parse response as JSON."
      }
      return Promise.reject(api_error);
    }
  
  }
  
  
  async postData(url = "", data: any) {
      // Default options are marked with *
     
      const response: Response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "omit", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
  
      return this.parseResponse(response);
    }
  
    async postDataWithAccessToken(url = "", data = {}, access_token: string) : Promise<any|ApiError> {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
  
      return this.parseResponse(response);
    }
  
    async APILogin(username: string, password: string) {
      return await this.postData(this.api_url + "login",{username: username, password: password});
    }
  
  async CreateTemplate(name: string, description: string) {
    const validated_creds = LoginUtil.getValidatedCredsFromLocal();
    const access_token = validated_creds.access_token;
    const create_template_req = {template_name: name, template_description: description, save: true};
    return await this.postDataWithAccessToken(this.api_url + "create_template",create_template_req,access_token);
  }
  
  
  
  async SearchTemplates(search: string) {
    const validated_creds = LoginUtil.getValidatedCredsFromLocal();
    const access_token = validated_creds.access_token;
    return await this.postDataWithAccessToken(this.api_url + "search_templates",{query: search},access_token);
  }

  async SearchTemplatesByUser(search: string) {
    const validated_creds = LoginUtil.getValidatedCredsFromLocal();
    const access_token = validated_creds.access_token;
    return await this.postDataWithAccessToken(this.api_url + "search_templates_by_user",{query: search},access_token);
  }

  async DeleteTemplate(uuid: string) {
    const validated_creds = LoginUtil.getValidatedCredsFromLocal();
    const access_token = validated_creds.access_token;
    return await this.postDataWithAccessToken(this.api_url + "delete_template",{uuid: uuid},access_token);
  }

  async CloneTemplate(uuid: string) {
    const validated_creds = LoginUtil.getValidatedCredsFromLocal();
    const access_token = validated_creds.access_token;
    return await this.postDataWithAccessToken(this.api_url + "clone_template",{uuid: uuid},access_token);
  }
  
    
  
  async TokenRefresh() {
      const validated_creds = LoginUtil.getValidatedCredsFromLocal();
      const access_token = validated_creds.access_token;
      const refresh_token = validated_creds.refresh_token;
      return await this.postDataWithAccessToken(this.api_url + "refresh_token",{refresh_token: refresh_token},access_token);
    }
  
   async GetTemplate(uuid:string) {
      const validated_creds = LoginUtil.getValidatedCredsFromLocal();
      const access_token = validated_creds.access_token;
      return await this.postDataWithAccessToken(this.api_url + "get_template",{uuid: uuid},access_token);
    }
  
   async SaveTemplate(template:Template) {
      const validated_creds = LoginUtil.getValidatedCredsFromLocal();
      const access_token = validated_creds.access_token;
      return await this.postDataWithAccessToken(this.api_url + "edit_template",{template: template},access_token);
    }
  
    async PushToSibyl(template:Template) {
      const validated_creds = LoginUtil.getValidatedCredsFromLocal();
      const access_token = validated_creds.access_token;
      return await this.postDataWithAccessToken(this.api_url + "push_to_sibyl",{uuid: template.uuid},access_token);
    }
  
    async GenerateSampleOutput(prompt:string,temperature: number, max_tokens: number, model: string, system_prompt: string) {
      const validated_creds = LoginUtil.getValidatedCredsFromLocal();
      const access_token = validated_creds.access_token;
      let temp = temperature as number;
      let request = {prompt:prompt, temperature: temp, max_tokens: max_tokens, model: model, system_prompt: system_prompt};
  
      return await this.postDataWithAccessToken(this.api_url + "sample_generation",request,access_token);
    }

}


  