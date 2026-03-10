(function () {
  const currentScript = document.currentScript;
  const storeId = currentScript?.getAttribute("data-store-id");
  const apiUrl = currentScript?.getAttribute("data-api-url") || "http://localhost:8787/api/chat/message";

  if (!storeId) return;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "16px";
  container.style.right = "16px";
  container.style.width = "320px";
  container.style.background = "white";
  container.style.border = "1px solid #ddd";
  container.style.borderRadius = "8px";
  container.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
  container.innerHTML = `
    <div style="padding:10px;background:#0f172a;color:white;border-radius:8px 8px 0 0;">Support boutique</div>
    <div id="chat-log" style="height:220px;overflow:auto;padding:10px;font-family:sans-serif;font-size:14px;"></div>
    <div style="display:flex;border-top:1px solid #eee;">
      <input id="chat-input" placeholder="Posez votre question..." style="flex:1;border:none;padding:10px;" />
      <button id="chat-send" style="border:none;background:#0f172a;color:white;padding:10px 14px;">Send</button>
    </div>
  `;
  document.body.appendChild(container);

  const visitorId = localStorage.getItem("chat_visitor_id") || crypto.randomUUID();
  localStorage.setItem("chat_visitor_id", visitorId);
  const conversationId = localStorage.getItem("chat_conv_id") || crypto.randomUUID();
  localStorage.setItem("chat_conv_id", conversationId);

  const log = container.querySelector("#chat-log");
  const input = container.querySelector("#chat-input");
  const send = container.querySelector("#chat-send");

  const appendMessage = (sender, text) => {
    const el = document.createElement("p");
    el.textContent = `${sender}: ${text}`;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  };

  send.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return;
    appendMessage("You", text);
    input.value = "";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        store_id: storeId,
        conversation_id: conversationId,
        visitor_id: visitorId,
        text,
        metadata: { locale: "fr-MA" }
      })
    });

    const data = await res.json();
    appendMessage("Bot", data.answer || "...");
  });
})();
