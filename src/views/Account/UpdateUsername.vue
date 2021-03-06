<template>
    <section>
        <page-header-with-button title="Username"></page-header-with-button>
        <div id="displayTitleAndButton">
            <back-button></back-button>
            <h1>Username</h1>
            <div></div>
        </div>
        <v-divider class="hidden-md-and-up"></v-divider>
        <article>
            <p>Your current username is @{{ userAccountData.username }}.</p>
            <form action="javascript:void(0)">
                <input type="text" id="newUsername" placeholder="New Username">
                <button @click="updateAccountUsername" id="saveButton">Save</button>
            </form>
            <p>{{ updateUsernameStatus }}</p>
        </article>
        <navigation-bar></navigation-bar>
    </section>
</template>

<script>
    import axios from "axios";
    import cookies from "vue-cookies";
    import PageHeaderWithButton from "../../components/PageHeaderWithButton.vue";
    import NavigationBar from "../../components/NavigationBar.vue";
    import BackButton from "../../components/BackButton.vue";

    export default {
        name: "Update-Username",
        
        components: {
            PageHeaderWithButton,
            NavigationBar,
            BackButton
        },

        data() {
            return {
                userAccountData: cookies.get("userData"),
                updateUsernameStatus: "",
                updateCurrentUsername: {
                    loginToken: cookies.get("loginToken")
                }
            }
        },

        methods: {
            // Creating a function that updates a user's username
            updateAccountUsername() {
                // Printing a loading message
                this.updateUsernameStatus = "Saving";

                // If the user has changed their username, store their new username as a variable
                if (document.getElementById("newUsername").value !== "") {
                    this.updateCurrentUsername.username = document.getElementById("newUsername").value;
                }

                // Configuring the axios request with the url, type and new username
                axios.request({
                    url: `${process.env.VUE_APP_API_URL}/users`,
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: this.updateCurrentUsername
                }).then((res) => {
                    // If the network is done and there are no errors, update the user's cookie with the new username
                    let updateAccountData = JSON.stringify(res.data);
                    cookies.set("userData", updateAccountData);
                    // Taking the user back to the previous page
                    this.$router.go(-1);
                }).catch((err) => {
                    // If the network is done and page errors, print an error message to the user
                    this.updateCurrentUsernameStatus = "An error occured while trying to save your changes.";
                    err;
                });
            }
        },

        mounted() {
            // If the user does not have a login token, take the user back to the Home page
            if(this.loginToken === null) {
                this.$router.push("/");
            }
        },
    }
</script>

<style scoped>
    section {
        background: white;
        height: 100%;
    }

    article {
        display: grid;
        place-items: center;
        row-gap: 10px;
        margin-top: 5vh;
    }

    p {
        font-size: 0.95rem;
    }

    form {
        display: grid;
        place-items: center;
        row-gap: 20px;
        width: 80%;
    }

    input {
        border-radius: 3px;
        border: 1px solid rgba(211, 211, 211, 0.8);
        padding: 2%;
        width: 100%;
    }

    input:focus {
        outline: none;
    }

    #saveButton {
        border: 1px solid var(--primaryColor);
        padding: 3%;
        color: var(--primaryColor);
        border-radius: 30px;
        width: 100%;
    }

    #saveButton:active {
        background: var(--primaryColor);
        color: white;
        font-weight: 700;
    }

    #displayTitleAndButton {
        display: none;
    }

    @media only screen and (min-width: 768px) {

        p, input, #saveButton {
            font-size: 1.2rem;
        }

        input, #saveButton {
            width: 60vw;
        }

        p {
            padding: 0vw;
            font-size: 1.2rem;
            font-weight: 300;
        }

        form {
            row-gap: 40px;
            margin-top: 1vh;
        }
    }

    @media only screen and (min-width: 1024px) {

        section {
            background: whitesmoke;
            display: grid;
            place-items: center;
        }

        article {
            width: 40%;
            box-shadow: 1px 5px 5px lightgrey;
            background: white;
            padding: 10vh 0vw 8vh 0vw;
            border-radius: 10px;
            row-gap: 30px;
            margin-top: 8vh;
        }

        p {
            font-size: 1rem;
        }

        input {
            width: 55%;
            padding: 1%;
        }

        input, #saveButton {
            font-size: 0.9rem;
        }

        section, form {
            row-gap: 30px;
        }

        #saveButton {
            width: 20%;
            padding: 8px;
            margin-top: 1vh;
        }

        #saveButton:hover {
            background: var(--primaryColor);
            color: white;
            font-weight: 700;
        }

        #displayTitleAndButton {
            display: grid;
            place-items: center;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: 30%;

            position: fixed;
            top: 0;
            width: 100%;
            box-shadow: 1px 5px 5px lightgrey;
            z-index: 1;
            background: white;
        }

        h1 {
            font-weight: 400;
            font-size: 1.2rem;
        } 
    }
</style>