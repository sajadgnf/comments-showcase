const container = document.querySelector(".container")
const userInfo = document.querySelector(".user_info")
const commentForm = document.querySelector('.comment_form')
const comment = document.querySelector('.comment_form textarea')
const url = "http://localhost:3000/"
let repliesArray = []

//get the data from api
const getUsers = async () => {
    const res = await fetch(`${url}comments`)
    const data = await res.json()
    return data
}

//set users info on UI
const renderUsers = async () => {

    //get users 
    const data = await getUsers()

    //render users on the UI
    data.forEach((item, index) => {
        let template = ""

        const { image, username } = item.user
        const { score, createdAt, currentUser, id, content } = item

        template = `
        <div class="comment">
            <div class="comment_container">
                <div class="vote">
                    <button class='vote_btn up_vote'><i class="far fa-thumbs-up"></i></button>  
                    <p class="score">${score}</p>
                    <button class='vote_btn down_vote'><i class="far fa-thumbs-down"></i></button>  
                </div>

                <div class="comment_info">
                    <div class="header">
                        <div class="user_info">
                            <img class=avatar src=${image.webp} alt="${username} image">
                            <h3 class="name">${username}</h3>
                            <p class="date">${createdAt}</p>
                        </div>
                        
                        ${currentUser ?
                `<div class="header_buutons_container">
                            <div onClick=editComment(event) class="header_buttons edit_btn">
                               <img src="assets/images/icon-edit.svg" alt="edit icon">
                               <p>Edit</p>
                           </div>
                           <div onClick=deleteComment(${id}) class="header_buttons delete-btn">
                              <img src="assets/images/icon-delete.svg" alt="delete icon">
                              <p>Delete</p>
                           </div>
                        </div>`  :
                `<div onClick=replyForm(${id}) id=${id} class="header_buutons_container header_buttons reply_btn" >
                              <img src="assets/images/icon-reply.svg" alt="reply icon">
                              <p>Reply</p>
                        </div>`
            }

                    </div>
                    <p class="comment_text">${content}</p>  
                </div>
            </div>

           <div class="replies">
                <div class="reply_line"></div>
                <div class="replies_container"></div>
           </div>
        </div>
        `
        container.insertAdjacentHTML('beforeend', template)

        //check if there is any reply for the comment
        if (item.replies.length > 0) {
            setReply(item.replies, index)
            repliesArray.push(item.replies)
        }
    })
    voting()
}

//user vote 
const voting = () => {

    const score = document.getElementsByClassName('score')
    const upVoteBtn = document.getElementsByClassName('up_vote')
    const downVoteBtn = document.getElementsByClassName('down_vote')
    let votes = []

    for (let i = 0; i < score.length; i += 1) {
        votes[i] = { upVote: false, downVote: false }

        //up vote function
        upVoteBtn[i].addEventListener('click', () => {

            //when user wants to reverse the vote
            if (votes[i].downVote) {
                score[i].innerHTML = Number(score[i].innerHTML) + 2
                upVoteBtn[i].classList.add("inactive")
                downVoteBtn[i].classList.remove('inactive')

                votes[i].upVote = true
                votes[i].downVote = false
            } else if (votes[i].upVote) {
                score[i].innerHTML = Number(score[i].innerHTML) - 1

                upVoteBtn[i].classList.remove("inactive")
                votes[i].upVote = false
            } else if (!votes[i].upVote) {
                score[i].innerHTML = Number(score[i].innerHTML) + 1

                upVoteBtn[i].classList.add("inactive")
                votes[i].upVote = true
            }
        })

        //down vote function
        downVoteBtn[i].addEventListener('click', () => {

            //when user wants to reverse the vote
            if (votes[i].upVote) {
                score[i].innerHTML = Number(score[i].innerHTML) - 2
                downVoteBtn[i].classList.add("inactive")
                upVoteBtn[i].classList.remove('inactive')

                votes[i].upVote = false
                votes[i].downVote = true
            } else if (votes[i].downVote) {
                score[i].innerHTML = Number(score[i].innerHTML) + 1

                downVoteBtn[i].classList.remove("inactive")
                votes[i].downVote = false
            }
            else if (!votes[i].downVote) {
                score[i].innerHTML = Number(score[i].innerHTML) - 1

                downVoteBtn[i].classList.add("inactive")
                votes[i].downVote = true
            }
        })
    }
}

//add comment
const addComment = async (event) => {
    event.preventDefault()
    if (commentForm.comment.value === '') return
    const doc = {
        currentUser: true,
        content: commentForm.comment.value,
        createdAt: new Date().toLocaleDateString(),
        score: Math.floor(Math.random() * 20),
        user: {
            image: {
                "png": "./assets/images/avatars/image-juliusomo.png",
                "webp": "./assets/images/avatars/image-juliusomo.webp"
            },
            username: "juliusomo"
        },
        replies: []
    }

    await fetch(`${url}comments`, {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    })
}

//edit comment
const editComment = event => {

    let editBtn = event.target

    if (editBtn !== event.currentTarget) {
        editBtn = event.target.parentElement
    }
    const textContainer = editBtn.parentNode.parentNode.nextElementSibling
    let text = ''

    if (textContainer.children.length > 0) {
        text = textContainer.firstElementChild.innerHTML + ' ' + textContainer.lastElementChild.innerHTML
    } else {
        text = textContainer.innerHTML
    }

    template = `
        <div class='edit_form_container'>
      <form onSubmit=updateComment(event) class="edit_form">
        <textarea name="comment">${text}</textarea>
        <button>UPDATE</button>
      </form>
    </div>
    `
    textContainer.remove()
    editBtn.parentNode.parentNode.parentNode.insertAdjacentHTML('beforeend', template)

    editBtn.style.pointerEvents = 'none'

    //check if there was a nother edit form open
    document.querySelectorAll('.edit_form_container').forEach(form => {

        if (editBtn.parentNode.parentNode.parentNode.lastElementChild !== form) {
            const el = document.createElement('p')
            el.classList.add('comment_text')
            el.innerHTML = form.firstElementChild.firstElementChild.value
            form.parentNode.appendChild(el)
            form.remove()
            document.querySelectorAll('.edit_btn').forEach(btn => btn.style.pointerEvents = 'all')
            editBtn.style.pointerEvents = 'none'
        }
    })
}

//update comment
const updateComment = (event) => {
    event.preventDefault()

    const updateValue = event.target.firstElementChild.value
    const spliteValue = updateValue.split(' ')

    if (updateValue === '') return

    if (spliteValue[0].includes('@')) {

        const container = document.createElement('div')

        const text = document.createElement('p')
        container.classList.add('comment_text')

        const id = document.createElement('span')
        id.classList.add('user_id')

        text.innerHTML = spliteValue.slice(1, spliteValue.length).join(' ')
        id.innerHTML = spliteValue[0]

        container.append(id, text)
        event.target.parentNode.parentNode.append(container)
    }
    else {
        const text = document.createElement('p')
        text.classList.add('comment_text')
        text.innerHTML = updateValue
        event.target.parentNode.parentNode.append(text)
    }

    event.target.parentNode.remove()
    document.querySelectorAll('.edit_btn').forEach(btn => btn.style.pointerEvents = 'all')
}

//delete comment
const deleteComment = async (id) => {
    if (window.confirm('are you sure that you want to delete comment?')) {
        await fetch(`${url}comments/${id}`, {
            method: 'DELETE'
        })
    }
}

// show the replies on the UI
const setReply = (reply, index) => {
    const repliesContainer = document.querySelectorAll('.replies_container')

    reply.forEach(item => {
        let template = document.createElement('div')

        const { image, username } = item.user
        const { score, createdAt, currentUser, id, content, replyingTo } = item

        template.innerHTML = `
            <div class="reply_container" id='${id}'>
                <div class="vote">
                    <button class='vote_btn up_vote'><i class="far fa-thumbs-up"></i></button>  
                    <p class="score">${score}</p>
                    <button class='vote_btn down_vote'><i class="far fa-thumbs-down"></i></button>  
                </div>

                <div class="reply_info">
                        <div class="header">
                            <div class="user_info">
                                <img class=avatar src=${image.webp} alt="${username} image">
                                <h3 class="name">${username}</h3>
                                <p class="date">${createdAt}</p>
                            </div>

                               ${currentUser ?
                `<div class="header_buutons_container">
                            <div onClick=editComment(event) class="header_buttons edit_btn">
                               <img src="assets/images/icon-edit.svg" alt="edit icon">
                               <p>Edit</p>
                           </div>
                           <div onClick=deleteReply(${index},${id}) class="header_buttons delete-btn">
                              <img src="assets/images/icon-delete.svg" alt="delete icon">
                              <p>Delete</p>
                           </div>
                        </div>`  :''
            }  
                    </div>
                    <div class="reply_text">
                    <span class='user_id'>@${replyingTo}</span>
                    <p> ${content} </p>
                    </div>
                </div >
            </div >
    `
        repliesContainer[index].appendChild(template)
    })
}

// form for replying to other comments
const replyForm = (id) => {

    let template = ''
    template = `
        <div class="reply_form">
      <form class="comment_form" onSubmit=handleReply(event,${id})>
        <img class="avatar" src="assets/images/avatars/image-juliusomo.webp" alt="user avatar">
        <textarea name="comment"></textarea>
        <button>REPLY</button>
      </form>
    </div>
    `
    const replyBtn = document.querySelectorAll('.header_buttons')
    replyBtn.forEach(btn => {
        const container = btn.parentNode.parentNode.parentNode

        if (parseInt(btn.id) === id) {
            container.insertAdjacentHTML('afterend', template)
            btn.style.pointerEvents = 'none'
        } else if (container.nextElementSibling !== null) {
            if (container.nextElementSibling.classList.contains('reply_form')) {
                container.nextElementSibling.remove()
                btn.style.pointerEvents = 'all'
            }
        }
    })
}

//submit the reply
const handleReply = async (event, id) => {
    event.preventDefault()

    //check if the form is open
    const replyBtn = document.querySelectorAll('.header_buttons')
    replyBtn.forEach(btn => {
        btn.style.pointerEvents = 'all'
    })

    //check if the form is empty
    if (event.target.children[1].value === '') {
        document.querySelectorAll('.reply_form').forEach(form => {
            form.remove()
        })
    } else {
        //get users
        const data = await getUsers()

        data.forEach(async (user) => {
            if (user.id == id) {

                const doc = {
                    replies: [
                        ...user.replies,
                        {
                            id: Math.floor(Math.random() * Math.floor(Math.random() * Date.now())),
                            currentUser: true,
                            content: event.target.children[1].value,
                            createdAt: new Date().toLocaleDateString(),
                            score: Math.floor(Math.random() * 10),
                            replyingTo: user.user.username,
                            user: {
                                image: {
                                    png: "./assets/images/avatars/image-juliusomo.png",
                                    webp: "./assets/images/avatars/image-juliusomo.webp"
                                },
                                username: "juliusomo"
                            }
                        }
                    ]
                }

                await fetch(`${url}comments/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(doc),
                    headers: { 'Content-Type': 'application/json' }
                })

                repliesArray.push(doc)
            }

        })
    }
}

//delete reply
const deleteReply = async (index, id) => {
    if (window.confirm('are you sure that you want to delete comment?')) {
        if (repliesArray[index]) {
            repliesArray[index] = repliesArray[index].filter(user => user.id != id)

            await fetch(`${url}comments/${index + 1}`, {
                method: 'PATCH',
                body: JSON.stringify({ replies: [...repliesArray[index]] }),
                headers: { 'Content-Type': 'application/json' }
            })
        }
        else {
            repliesArray[0] = repliesArray[0].filter(user => user.id != id)

            await fetch(`${url}comments/${index + 1}`, {
                method: 'PATCH',
                body: JSON.stringify({ replies: [...repliesArray[0]] }),
                headers: { 'Content-Type': 'application/json' }
            })
        }

        if (repliesArray.length <= 1) {
            await fetch(`${url}comments/${index + 1}`, {
                method: 'PATCH',
                body: JSON.stringify({ replies: [] }),
                headers: { 'Content-Type': 'application/json' }
            })
        }
    }
}

// check if there was a nother form open
const clearForms = () => {
    //delete reply forms
    document.querySelectorAll('.comment_form').forEach(form => {
        if (!form.classList.contains('main_form')) {
            form.style.display = 'none'
        }
    })
    document.querySelectorAll('.reply_btn').forEach(btn => btn.style.pointerEvents = 'all')
}


//events
window.addEventListener("load", renderUsers)
commentForm.addEventListener('submit', addComment)
comment.addEventListener('click', clearForms)


