export async function sendTelegramNotification(message: string) {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramToken || !chatId) {
    console.log("Telegram notification skipped (missing credentials)");
    return;
  }

  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML"
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Telegram API HTTP error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }

    console.log("Telegram notification sent successfully");
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Telegram notification request timed out");
    } else {
      console.error("Failed to send Telegram notification:", error);
    }
    throw error;
  }
}