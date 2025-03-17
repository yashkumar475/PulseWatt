document.addEventListener("DOMContentLoaded", function () {
    const addMemberBtn = document.getElementById("addMember");
    const modal = document.getElementById("memberModal");
    const closeModal = document.querySelector(".close");
    const saveMemberBtn = document.getElementById("saveMember");
    const memberList = document.getElementById("memberList");
    let editingRow = null;

    // Open modal
    addMemberBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        clearForm();
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Save member (add or update)
    saveMemberBtn.addEventListener("click", () => {
        const name = document.getElementById("memberName").value.trim();
        const email = document.getElementById("memberEmail").value.trim();
        const status = document.getElementById("memberStatus").value;

        if (!name || !email) {
            alert("Please fill all fields");
            return;
        }

        if (editingRow) {
            // Edit existing member
            editingRow.children[0].textContent = name;
            editingRow.children[1].textContent = email;
            editingRow.children[2].textContent = status;
            editingRow = null;
        } else {
            // Add new member
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${name}</td>
                <td>${email}</td>
                <td>${status}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;
            memberList.appendChild(newRow);
            attachRowEvents(newRow);
        }

        updateStats();
        modal.style.display = "none";
        clearForm();
    });

    // Attach event listeners to existing rows
    document.querySelectorAll("#memberList tr").forEach(row => attachRowEvents(row));

    function attachRowEvents(row) {
        row.querySelector(".edit").addEventListener("click", () => {
            editingRow = row;
            document.getElementById("memberName").value = row.children[0].textContent;
            document.getElementById("memberEmail").value = row.children[1].textContent;
            document.getElementById("memberStatus").value = row.children[2].textContent;
            modal.style.display = "flex";
        });

        row.querySelector(".delete").addEventListener("click", () => {
            row.remove();
            updateStats();
        });
    }

    function updateStats() {
        const total = document.querySelectorAll("#memberList tr").length;
        const active = document.querySelectorAll("#memberList tr td:nth-child(3):contains('Active')").length;
        document.getElementById("total-members").textContent = `Total Members: ${total}`;
        document.getElementById("active-members").textContent = `Active Members: ${active}`;
        document.getElementById("inactive-members").textContent = `Inactive Members: ${total - active}`;
    }

    function clearForm() {
        document.getElementById("memberName").value = "";
        document.getElementById("memberEmail").value = "";
        document.getElementById("memberStatus").value = "Active";
    }

    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});
