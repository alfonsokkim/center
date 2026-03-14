console.log("Content script injected!");

const getPageTitle = () => {
  return (
    document.title?.trim() ||
    document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute("content")
      ?.trim() ||
    document
      .querySelector('meta[name="twitter:title"]')
      ?.getAttribute("content")
      ?.trim() ||
    ""
  );
};

const sendPageTitleToBackend = async () => {
  const title = getPageTitle();

  if (!title) return;

  try {
    await fetch("http://localhost:8000/page-title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        url: window.location.href,
      }),
    });
  } catch (error) {
    console.error("Failed to send page title:", error);
  }
};

sendPageTitleToBackend();
