const ornaments = document.querySelectorAll(".ornament");
const tree = document.querySelector("#tree");
const resetButton = document.getElementById("reset-button");

// Add drag-and-drop functionality to initial ornaments
ornaments.forEach(ornament => {
  ornament.addEventListener("dragstart", handleDragStart);
  ornament.addEventListener("dragend", handleDragEnd);
});

const dropzone = document.createElement("div");
dropzone.classList.add("dropzone");
tree.appendChild(dropzone);

dropzone.addEventListener("dragover", handleDragOver);
dropzone.addEventListener("drop", handleDrop);

function handleDragStart(e) {
  e.dataTransfer.setData("image", e.target.src);
  e.dataTransfer.setData("id", e.target.dataset.id || ""); // Track the ornament ID
  e.target.classList.add("dragging");
}

function handleDragEnd(e) {
  const rect = tree.getBoundingClientRect();
  const isOutsideTree =
    e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;

  if (isOutsideTree && e.target.dataset.id) {
    e.target.remove(); // Remove the ornament if it's outside the tree
  }
  e.target.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault(); // Necessary for drop to work
}

function handleDrop(e) {
  e.preventDefault();

  // Get the dropped ornament's source and ID
  const ornamentSrc = e.dataTransfer.getData("image");
  const ornamentId = e.dataTransfer.getData("id");

  // Reposition existing ornament if ID matches
  if (ornamentId) {
    const existingOrnament = document.querySelector(`[data-id="${ornamentId}"]`);
    if (existingOrnament) {
      const rect = tree.getBoundingClientRect();
      const x = e.clientX - rect.left - 25; // Adjust for ornament size
      const y = e.clientY - rect.top - 25;

      existingOrnament.style.left = `${x}px`;
      existingOrnament.style.top = `${y}px`;
      return;
    }
  }

  // Create a new ornament (for initial drag-and-drop from outside)
  const newOrnament = document.createElement("img");
  newOrnament.src = ornamentSrc;
  newOrnament.className = "ornament";
  newOrnament.draggable = true;

  // Generate a unique ID for the ornament
  const newId = `ornament-${Date.now()}`;
  newOrnament.dataset.id = newId;

  // Apply styles to the new ornament
  newOrnament.style.position = "absolute";
  newOrnament.style.width = "50px"; // Ensure size matches the original
  newOrnament.style.height = "50px";
  newOrnament.style.cursor = "grab";

  // Add drag-and-drop functionality to the new ornament
  newOrnament.addEventListener("dragstart", handleDragStart);
  newOrnament.addEventListener("dragend", handleDragEnd);

  const rect = tree.getBoundingClientRect();
  const x = e.clientX - rect.left - 25; // Adjust for ornament size
  const y = e.clientY - rect.top - 25;

  newOrnament.style.left = `${x}px`;
  newOrnament.style.top = `${y}px`;

  tree.appendChild(newOrnament);
}

// Reset button functionality
resetButton.addEventListener("click", () => {
  const ornamentsOnTree = tree.querySelectorAll(".ornament");
  ornamentsOnTree.forEach(ornament => ornament.remove());
});
