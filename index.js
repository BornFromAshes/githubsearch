const imageOutput = document.querySelector('.image');
const nameOutput = document.querySelector('.name');
const linkOutput = document.querySelector('.link');
const locOutput = document.querySelector('.loc');
const bioOutput = document.querySelector('.bio');
const userInput = document.querySelector('#user');
const searchInput = document.querySelector('.search_button');
const errorOutput = document.querySelector('.error');
const langOutput = document.querySelector('.lang')

async function searchGit(e){
    e.preventDefault();
    let username = userInput.value;
    try {
        let saved = JSON.parse(window.localStorage.getItem(username));
        let response;
        let obj;
        let repos;
        if (saved == null || saved.login != username){
            response = await fetch(`https://api.github.com/users/${username}`);
            obj = await response.json();
            repos = await fetch(obj.repos_url);
            repos = await repos.json();
            if (response.status != 200){
                errorOutput.innerHTML="USER NOT FOUND!";
                errorOutput.classList.remove('error');
                return;
            }
        }
        else{
            obj = saved;
        }   
        setUser(obj);
        saveUser(obj);
        setlang(repos);
    } catch (error) {
        errorOutput.innerHTML="NETWORK ERROR!";
        errorOutput.classList.remove('error');
        return;
    }
}

function setUser(obj){
    nameOutput.innerHTML=obj.name;
    linkOutput.innerHTML=obj.blog;
    locOutput.innerHTML=obj.location;
    let bio = obj.bio.split('\n').join('<br>')
    bioOutput.innerHTML=bio;
    imageOutput.setAttribute("src", obj.avatar_url);
}

function saveUser(obj){
    const userObj = {
        login: obj.login,
        name: obj.name,
        blog: obj.blog,
        location: obj.location,
        bio: obj.bio,
        avatar_url: obj.avatar_url
    }
    window.localStorage.setItem(obj.login, JSON.stringify(userObj));
}

function setlang(obj){
    langs = []
    for(i = 0; i < 5; i++){
        langs.push(obj[i].language)
    }
    console.log(langs);
    let fav = null;
    let top_point = 0;
    for(i = 0; i < 5; i++){
        if (langs[i] == null){
            continue;
        }
        let point = 0;
        for(j = 0; j < 5; j++){
            if (langs[j] == langs[i]){
                point += 1;
            }
        }
        if (point > top_point){
            top_point = point;
            fav = langs[i];
        }
    }
    langOutput.innerHTML="Favourite language = " + fav;
}

searchInput.addEventListener('click', searchGit);
window.localStorage.clear();