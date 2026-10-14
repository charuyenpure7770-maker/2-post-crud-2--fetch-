const cl = console.log;
const spinner = document.getElementById('spinner');
const postContainer = document.getElementById('postContainer');
const form = document.getElementById("form");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const addPostBtn = document.getElementById("addPostBtn");
const updatePostBtn = document.getElementById("updatePostBtn");
//url

let BASE_URL = "https://fetch-api-crud-e52ad-default-rtdb.asia-southeast1.firebasedatabase.app"
let POST_URL = `${BASE_URL}/posts.json`

//swalfire
function snackaBar(msg, icon){
  Swal.fire({
    text:msg,
    icon:icon,
    timer:2500
  })
}
//spinner
  function showHideSpinner(){
    spinner.classList.toggle("d-none");
  }

//state
  const state = {
    postsArr :[],
    EDIT_ID :null
  }

//read
function showUi(){
 showHideSpinner();
 fetch(POST_URL,{
  method:"GET",
  body:null,
  headers:{
    "content-type":"application/json",
    "authorization":"JWT token"
  }
 })
 .then((res)=>{
  return res.json()
 })
 .then((data)=>{
  cl(data);
   for(const key in data){
    data[key].id = key
    state.postsArr.push(data[key]);
    cl(state.postsArr)
   }
  templeting(state.postsArr);
 })
 .catch((err)=>{
  snackaBar("somthing went wrong");
 })
 .finally(()=>{
  showHideSpinner()
 })
}

function templeting(arr){
let result =  ``;
arr.forEach(ele => {
  result+=  `<div class="col-md-4 mb-3" id=${ele.id}>
                <div class="card shadow">
                    <div class="card-header">
                        <h3 class="m-0">${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${ele.description}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-primary">Edit</button>
                        <button onclick="onRemove(this)" type="button" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            </div>`
});
postContainer.innerHTML = result;
}
showUi();

//crete
function onAddPost(eve){
  eve.preventDefault();
  let newObj ={
    title: titleControl.value,
    description:bodyControl.value
  }
  showHideSpinner();
  fetch(POST_URL,{
    method:"post",
    body:JSON.stringify(newObj),
    headers:{
      "content-type":"application/json",
    "authorization":"JWT TOKEN"
      }
  })
  .then((res)=>{
    if(!res.ok){
      throw new Error("something went wrong");
    }
    return res.json();
  })
  .then((data)=>{
    cl(data);
    newObj.id = data.name;
    state.postsArr.push(newObj);
    let div = document.createElement("div");
    div.id = newObj.id
    div.className = "col-md-4 mb-3";
    div.innerHTML = `<div class="card shadow">
                    <div class="card-header">
                        <h3 class="m-0">${newObj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${newObj.description}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-primary">Edit</button>
                        <button onclick="onRemove(this)" type="button" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>`
                postContainer.append(div);
                snackaBar("post added successfully","success");
                form.reset();

  })
  .catch((err)=>{
   snackaBar(err.message,"error")
  })
  .finally(()=>{
    showHideSpinner();
  })
}

//edit 
function onEdit(ele){
  let EDIT_ID = ele.closest(".col-md-4").id;
  state.EDIT_ID = EDIT_ID
  let edit_obj = state.postsArr.find(obj => obj.id === EDIT_ID);
  cl(edit_obj)
   titleControl.value = edit_obj.title;
   bodyControl.value = edit_obj.description;
  addPostBtn.classList.add("d-none");
  updatePostBtn.classList.remove("d-none");
}
//update 
function onUpdate(ele){
  let UPDATE_ID = state.EDIT_ID;
  let update_url = `${BASE_URL}/posts/${UPDATE_ID}.json`
  let update_Obj ={
      title: titleControl.value,
    description:bodyControl.value,
    id:UPDATE_ID
  }
  showHideSpinner();
  fetch(update_url,{
    method:"PATCH",
    body:JSON.stringify(update_Obj),
    headers:{
      "content-type":"application/json",
      "authorization":"JWT token"
    }
  })
  .then((res)=>{
   if(!res.ok){
    throw new Error("something went wrong");
   }
   return res.json();
  })
  .then((data)=>{
  cl(data);
  let getIndex = state.postsArr.findIndex(obj=> obj.id === UPDATE_ID)
  state.postsArr[getIndex] = update_Obj;
  let div = document.getElementById(UPDATE_ID);
  div.innerHTML = `<div class="card shadow">
                    <div class="card-header">
                        <h3 class="m-0">${update_Obj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${update_Obj.description}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-primary">Edit</button>
                        <button onclick="onRemove(this)" type="button" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>`
                updatePostBtn.classList.add("d-none");
                addPostBtn.classList.remove("d-none");
                form.reset();
                snackaBar("post is updated successfully","success");
})
  .catch((err)=>{
   snackaBar(err.message,"error")
  })
  .finally(()=>{
  showHideSpinner();
  })
}
//delete 
 function onRemove(ele){
  Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let remove_id = ele.closest(".col-md-4").id;
    let delete_url = `${BASE_URL}/posts/${remove_id}.json`

    showHideSpinner()
    fetch(delete_url,{
      method:"DELETE",
      body:null,
      headers:{
        "content-type":"application/json",
        "authorization":"JWT token"
      }
    }).then((res)=>{
     if(!res.ok){
      throw new Error("something went wrong");
     }
     return res.json();
    })
    .then((data)=>{
      let index = state.postsArr.findIndex(obj=> obj.id === remove_id);
      state.postsArr.splice(index, 1);
      ele.closest(".col-md-4").remove();  
      snackaBar("todo is removed successfully","success"); 
    })
   .catch((err)=>{
    snackaBar(err.message,"error")
   })
   .finally(()=>{
    showHideSpinner();
   })
  }
});
 }
updatePostBtn.addEventListener("click",onUpdate);
form.addEventListener("submit",onAddPost);

