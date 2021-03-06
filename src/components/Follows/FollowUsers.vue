<template>
    <div>
        <!-- Add "follow" buttons on users' profiles, not including the account holder's profile -->
        <button v-if="followUserId !== ownerData.userId" @click="checkFollows" :id="`followButton${followUserId}`">Follow</button>
    </div>
</template>

<script>
    import axios from "axios";
    import cookies from "vue-cookies";

    export default {
        name: "follow-users",

        data() {
            return {
                isFollowingUser: false,
                ownerData: cookies.get("userData"),
                countFollows: [],
                displayFollows: 0
            }
        },

        // Receiving the follow user id from the UsersProfile view
        props: {
            followUserId: Number
        },

        methods: {
            // Creating a function that will change the style of the button
            buttonStyle(followStatus, buttonColor, textColor, borderColor) {
                document.getElementById(`followButton${this.followUserId}`).innerHTML = followStatus;
                document.getElementById(`followButton${this.followUserId}`).style.background = buttonColor;
                document.getElementById(`followButton${this.followUserId}`).style.color = textColor;
                document.getElementById(`followButton${this.followUserId}`).style.border = `1px solid ${borderColor}`;
            },

            // Creating a function that will allow a user to follow another user
            getAllFollowsFromAPI() {
                // Configuring an axios request with the url, type and user id
                axios.request({
                    url: `${process.env.VUE_APP_API_URL}/follows`,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json"
                    },
                    params: {
                        userId: cookies.get("userData").userId
                    }
                }).then((res) => {
                    // If the network is done and there are no errors, store the user's follows and total number of follows into a variable
                    this.countFollows = res.data;
                    this.displayFollows = res.data.length;
                    // Checking to see if the account holder is already following a user on their follows list
                    for (let i = 0; i < this.countFollows.length; i++) {
                        if(this.countFollows[i].userId === this.followUserId) {
                            this.isFollowingUser = true;
                            this.buttonStyle("Following", "#60A3D9", "white", "#60A3D9");
                        }
                    }
                    res;
                }).catch((err) => {
                    err;
                });
            },

            // Creating a function that will follow a user
            checkFollows() {
                // On click, if the account holder is not following a user, send an axios request that "creates" a follow
                if(!this.isFollowingUser) {
                    axios.request({
                        url: `${process.env.VUE_APP_API_URL}/follows`,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: {
                            loginToken: cookies.get("loginToken"),
                            followId: this.followUserId
                        }
                    }).then((res) => {
                        // If the network is done and no errors occur, increase the number of follows the account holder has by one
                        this.isFollowingUser = true;
                        this.displayFollows++;
                        // Changing the button text and colour when the account holder follows another user
                        this.buttonStyle("Following", "#60A3D9", "white", "#60A3D9");
                        res;
                    }).catch((err) => {
                        err;
                    });
                } 

                // Creating a function to unfollow a user
                else {
                    // On click, if the account holder is already following a user, send an axios that "deletes" a follow
                    axios.request({
                        url: `${process.env.VUE_APP_API_URL}/follows`,
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: {
                            loginToken: cookies.get("loginToken"),
                            followId: this.followUserId
                        }
                    }).then((res) => {
                        // If the network is done and no errors occur, decrease the number of follows the account holder has by one
                        this.isFollowingUser = false;
                        this.displayFollows--;
                        // Change the button text and colour when the account holder unfollows another user
                        this.buttonStyle("Follow", "white", "#60A3D9", "#60A3D9");
                        res;
                    }).catch((err) => {
                        err;
                    });
                }
            }
        },

        mounted() {
            // When the page refreshes, send axios request to get all the user's follows
            this.getAllFollowsFromAPI();
        },
    }
</script>

<style scoped>
    div {
        display: grid;
        place-items: center;
    }

    button {
        color: var(--primaryColor);
        font-size: 0.9rem;
        border: 1px solid var(--primaryColor);
        border-radius: 30px;
        width: 55vw;
        padding: 1vh 0vh;
        text-align: center;
    }

    @media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {

        div {
            width: 85vw;
            row-gap: 40px;
        }

        button {
            width: 30vw;
            font-size: 1.1rem;
        }
    }

    @media only screen and (min-width: 1024px) {

        button {
            width: 8vw;
            font-size: 0.7rem;
            padding: 5%;
        }
    }
</style>