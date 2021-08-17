import Baseurl from "./components/Baseurl";

const baseurl = Baseurl();

export class API{

    static async fetcher(url, requestSettings){
      let request = await fetch(url, requestSettings);
      let response = await request.json();
      return response;
    }

    static Login(body) {
        let url = baseurl + "/api/v3/login";
        let requestSettings = {method: "POST", headers:{"Content-Type": "application/json"}, body: JSON.stringify(body)}
        let response = this.fetcher(url, requestSettings);
        return response;
    }
    
    static Register(body) {
        let url = baseurl + "/api/v3/register";
        let requestSettings = {method: "POST", headers:{"Content-Type": "application/json"}, body: JSON.stringify(body)}
        let response = this.fetcher(url, requestSettings);
        return response;
    }

    static AddNoteAPI(body){
      let url = baseurl + "/api/v3/todos/note";
      let requestSettings = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}
      let response = this.fetcher(url, requestSettings);
      return response;
    }

    static GetNotes(){
      let url = baseurl +  "/api/v3/todos";
      let requestSettings = {method: "GET", headers: {"Content-Type": "application/json"}}
      let response = this.fetcher(url, requestSettings);
      return response;
    }

    static DeleteNote(body){
      let url = baseurl + "/api/v3/todos/note";
      let requestSettings = {method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}
      let response = this.fetcher(url, requestSettings);
      return response;
    }

    static UpdateNoteandTaskcontent(body){
      let url = baseurl + "/api/v3/todos/note";
      let requestSettings = {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}
      let response = this.fetcher(url, requestSettings);
      return response;
    }

    static UpdateTaskDescription(body){
      let url = baseurl + "/api/v3/todos/note/todo";
      let requestSettings = {method: "PUT", headers: { "Content-Type": "application/json"}, body: JSON.stringify(body)}
      let response = this.fetcher(url, requestSettings);
      return response;
    }

    static RemoveTask(body){
      let url = baseurl + "/api/v3/todos/note/todo";
      let requestSettings = {method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}
      let response = this.fetcher(url, requestSettings);
      return response;
    }

    static StatusUpdate(body){
      let url = baseurl + "/api/v3/todos/note/todo/update";
      let requestSettings = {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}
      let response = this.fetcher(url, requestSettings);
      return response;
    }
}