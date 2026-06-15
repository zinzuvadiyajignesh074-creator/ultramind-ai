let user = "";

function add(text, type = "") {
  const div = document.createElement("div");
  div.innerText = text;
  document.getElementById("chatBox").appendChild(div);
}

async function send() {
  user = document.getElementById("user").value;

  const msg = document.getElementById("msg").value;
  add("You: " + msg);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, message: msg })
  });

  const data = await res.json();
  add("AI: " + data.reply);
}

async function loadHistory() {
  user = document.getElementById("user").value;

  const res = await fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user })
  });

  const data = await res.json();

  data.history.forEach(m => add(m.role + ": " + m.text));
    }
