document.addEventListener("DOMContentLoaded", function () {
  const bookSelect = document.getElementById("book-select");
  const chapterSelect = document.getElementById("chapter-select");
  const verseSelect = document.getElementById("verse-select");
  const content = document.getElementById("content");

  const books = ["genesis", "exodus" /* add all other books here */];

  // Populate the book dropdown
  books.forEach((book) => {
    const option = document.createElement("option");
    option.value = book;
    option.text = book.charAt(0).toUpperCase() + book.slice(1);
    bookSelect.appendChild(option);
  });

  bookSelect.addEventListener("change", () => {
    const selectedBook = bookSelect.value;
    loadChapters(selectedBook);
  });

  chapterSelect.addEventListener("change", () => {
    const selectedBook = bookSelect.value;
    const selectedChapter = chapterSelect.value;
    if (selectedChapter) {
      loadVerses(selectedBook, selectedChapter);
    }
  });

  verseSelect.addEventListener("change", () => {
    const selectedVerse = verseSelect.value;
    if (selectedVerse) {
      scrollToVerse(selectedVerse);
    }
  });

  function loadChapters(book) {
    fetch(`json/${book}.json`)
      .then((response) => response.json())
      .then((data) => {
        chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
        verseSelect.innerHTML = '<option value="">Select Verse</option>';
        content.innerHTML = "<p>Select a chapter to start reading.</p>";

        data.chapters.forEach((chapterData) => {
          const option = document.createElement("option");
          option.value = chapterData.chapter;
          option.text = `Chapter ${chapterData.chapter}`;
          chapterSelect.appendChild(option);
        });

        // Automatically load the first chapter
        chapterSelect.value = data.chapters[0].chapter;
        loadVerses(book, chapterSelect.value);
      });
  }

  function loadVerses(book, chapter) {
    fetch(`json/${book}.json`)
      .then((response) => response.json())
      .then((data) => {
        const selectedChapter = data.chapters.find(
          (ch) => ch.chapter == chapter
        );
        if (selectedChapter) {
          verseSelect.innerHTML = '<option value="">Select Verse</option>';
          content.innerHTML = "";

          selectedChapter.verses.forEach((verseData) => {
            // Populate verse dropdown
            const option = document.createElement("option");
            option.value = verseData.verse;
            option.text = `Verse ${verseData.verse}`;
            verseSelect.appendChild(option);

            // Display verses in content area
            const verseElement = document.createElement("p");
            verseElement.innerText = `${verseData.verse}. ${verseData.text}`;
            verseElement.id = `verse-${verseData.verse}`;
            content.appendChild(verseElement);
          });

          // Scroll to the top of the content area after loading the verses
          scrollToContentTop();
        }
      });
  }

  function scrollToVerse(verse) {
    const verseElement = document.getElementById(`verse-${verse}`);
    const headerOffset = document.getElementById("sticky-header").offsetHeight;

    if (verseElement) {
      const elementPosition = verseElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset - 10;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Add the highlight effect
      verseElement.classList.add("highlight");

      // Remove the highlight after 1 second
      setTimeout(() => {
        verseElement.classList.remove("highlight");
      }, 1000);
    } else {
      console.error(`Verse element with ID verse-${verse} not found.`);
    }
  }

  function scrollToContentTop() {
    const headerOffset = document.getElementById("sticky-header").offsetHeight;

    // Scroll to the top of the content area, offsetting by the header height
    window.scrollTo({
      top: content.offsetTop - headerOffset,
      behavior: "smooth",
    });
  }

  // Automatically load Genesis on page load
  loadChapters("genesis");
});
