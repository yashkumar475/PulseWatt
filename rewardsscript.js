document.addEventListener("DOMContentLoaded", function () {
    const rewardsContainer = document.querySelector(".rewards-container");
    let activePopup = null;

    // Mock data for users with random profile images
    const users = [
        { name: "John Doe", energy: 1200, discount: 10, image: "https://randomuser.me/api/portraits/men/1.jpg", redeemed: "Not Redeemed" },
        { name: "Jane Smith", energy: 1500, discount: 15, image: "https://randomuser.me/api/portraits/women/2.jpg", redeemed: "Not Redeemed" },
        { name: "Chris Evans", energy: 900, discount: 8, image: "https://randomuser.me/api/portraits/men/3.jpg", redeemed: "Not Redeemed" },
        { name: "Emma Watson", energy: 1800, discount: 20, image: "https://randomuser.me/api/portraits/women/4.jpg", redeemed: "Not Redeemed" },
        { name: "Emma Watson", energy: 1800, discount: 20, image: "https://randomuser.me/api/portraits/women/4.jpg", redeemed: "Not Redeemed" }

    ];

    function loadRewards() {
        rewardsContainer.innerHTML = "";
        users.forEach(user => {
            const profileCard = document.createElement("div");
            profileCard.classList.add("profile-card");
            profileCard.innerHTML = `
                <img src="${user.image}" alt="${user.name}">
                <h3 class="user-name">${user.name}</h3>
                <p>Energy Generated: <span class="energy">${user.energy}W</span></p>
                <p>Discount Earned: <span class="discount">${user.discount}%</span></p>
                <p class="redeemed-status">Redeemed In: <span>${user.redeemed}</span></p>
                <button class="redeem-btn">Redeem Reward</button>
            `;
            rewardsContainer.appendChild(profileCard);

            profileCard.querySelector(".redeem-btn").addEventListener("click", () => openRedeemPopup(user, profileCard));
        });
    }

    function openRedeemPopup(user, profileCard) {
        if (activePopup) return;
        
        activePopup = document.createElement("div");
        activePopup.classList.add("popup");
        activePopup.innerHTML = `
            <div class="popup-content">
                <h3>Redeem Reward for ${user.name}</h3>
                <p>Select where you want to use your discount:</p>
                <button class="option-btn" data-option="Canteen">Canteen</button>
                <button class="option-btn" data-option="Gym Fee">Gym Fee</button>
                <button class="option-btn" data-option="Protein Buying">Protein Buying</button>
                <button class="option-btn" data-option="Eatables">Eatables</button>
                <button class="close-btn">Cancel</button>
            </div>
        `;
        document.body.appendChild(activePopup);
        
        activePopup.style.display = "flex";
        activePopup.style.justifyContent = "center";
        activePopup.style.alignItems = "center";
        activePopup.style.position = "fixed";
        activePopup.style.top = "0";
        activePopup.style.left = "0";
        activePopup.style.width = "100vw";
        activePopup.style.height = "100vh";
        activePopup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

        const popupContent = activePopup.querySelector(".popup-content");
        popupContent.style.backgroundColor = "#fff";
        popupContent.style.padding = "20px";
        popupContent.style.borderRadius = "10px";
        popupContent.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        popupContent.style.textAlign = "center";
        popupContent.style.width = "300px";

        activePopup.querySelectorAll(".option-btn").forEach(button => {
            button.style.display = "block";
            button.style.width = "100%";
            button.style.margin = "10px 0";
            button.style.padding = "10px";
            button.style.backgroundColor = "#1775F1";
            button.style.color = "white";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
        });

        activePopup.querySelector(".close-btn").style.backgroundColor = "#d9534f";
        activePopup.querySelector(".close-btn").style.marginTop = "10px";
        activePopup.querySelector(".close-btn").addEventListener("click", closePopup);

        activePopup.querySelectorAll(".option-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const selectedOption = event.target.getAttribute("data-option");
                updateProfileCard(user, profileCard, selectedOption);
                closePopup();
            });
        });
    }

    function updateProfileCard(user, profileCard, option) {
        user.redeemed = option;
        profileCard.querySelector(".redeemed-status span").textContent = option;
    }

    function closePopup() {
        if (activePopup) {
            document.body.removeChild(activePopup);
            activePopup = null;
        }
    }

    loadRewards();
});
