function handleShareClick() {
  const shareData = {
    title: "Cities over 5M - Map",
    text: "Explore 87 global cities with 5M+ population and their 2025 growth 📈",
    url: "https://markomaps.com/cities5m/"
  };

  if (navigator.share) {
    navigator.share(shareData).catch((err) => {
      console.error("Share failed:", err);
    });
  } else {
    // Fallback: open modal or dropdown with manual share links
    openModal('shareModal');
  }
}

function copyShareUrl() {
  const url = "https://markomaps.com/cities5m/";
  navigator.clipboard.writeText(url).then(() => {
    document.getElementById("copyFeedback").style.display = "block";
    setTimeout(() => {
      document.getElementById("copyFeedback").style.display = "none";
    }, 2000);
  });
}