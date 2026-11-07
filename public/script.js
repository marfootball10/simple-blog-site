const commentsList = document.getElementById("comments-list");
const commentsStatus = document.getElementById("comments-status");
const commentForm = document.getElementById("comment-form");
const formStatus = document.getElementById("form-status");

// GET - Retrieve comments from the backend
async function loadComments() {
    try {
        const response = await fetch("/api/comments");
        if (!response.ok) {
            throw new Error("Failed to load comments.");
        }
        const comments = await response.json();
        commentsList.replaceChildren();
        if (comments.length === 0) {
            commentsStatus.textContent = "No comments yet.";
            return;
        }

        commentsStatus.textContent = "";

        comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.className = "comment";

            const username = document.createElement("h3");
            username.textContent = comment.username;

            const body = document.createElement("p");
            body.textContent = comment.body;

            commentElement.append(username, body);
            commentsList.append(commentElement);
        });

    } catch (error) {
        commentsStatus.textContent = "Could not load comments.";
        console.error(error);
    }
}

// POST - Submit a new comment
commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const body = document.getElementById("body").value;

    const button = commentForm.querySelector("button");

    button.disabled = true;
    formStatus.textContent = "";

    try {
        const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                body: body
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to post comment.");
        }

        commentForm.reset();
        formStatus.textContent = "Comment posted!";

        await loadComments();

    } catch (error) {
        formStatus.textContent = error.message;
    } finally {
        button.disabled = false;
    }
});

loadComments();