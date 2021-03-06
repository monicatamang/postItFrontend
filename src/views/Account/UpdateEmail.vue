<template>
    <section>
        <page-header-with-button title="Email"></page-header-with-button>
        <div id="displayTitleAndButton">
            <back-button></back-button>
            <h1>Email</h1>
            <div></div>
        </div>
        <v-divider class="hidden-md-and-up"></v-divider>
        <form action="javascript:void(0)">
            <p>Your current email is {{ userData.email }}. What would you like to change it to?</p>
            <input type="text" id="newEmail" placeholder="New Email">
            <input type="submit" id="saveNewEmail" value="Save" @click="updateUserAccountEmail">
            <p>{{ updateEmailStatus }}</p>
        </form>
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
        name: "Update-Email",

        components: {
            PageHeaderWithButton,
            NavigationBar,
            BackButton
        },

        data: function() {
            return {
                userData: cookies.get("userData"),
                updateEmailStatus: "",
                updateEmail: {
                    loginToken: cookies.get("loginToken")
                }
            }
        },

        methods: {
            // Creating a function that will update the user's email
            updateUserAccountEmail() {
                // Printing a loading message
                this.updateEmailStatus = "Saving";

                // Updating the value of the user's email to the new email they entered into the input field
                if (document.getElementById("newEmail").value !== null) {
                    this.updateEmail.email = document.getElementById("newEmail").value;
                }

                // Configuring the axios request with the url, type and new email
                axios.request({
                    url: `${process.env.VUE_APP_API_URL}/users`,
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: this.updateEmail
                }).then((res) => {
                    // If the network is done and there are no errors, update the user's cookie with the new email
                    let updateAccountData = JSON.stringify(res.data);
                    cookies.set("userData", updateAccountData);
                    // Taking the user back to the previous page
                    this.$router.go(-1);
                }).catch((err) => {
                    // If the network is done and the page errors, print an error message to the user
                    this.updateEmailStatus = "An error occured while trying to save your changes.";
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

    form {
        display: grid;
        place-items: center;
        row-gap: 20px;
    }

    p {
        font-size: 0.95rem;
        text-align: center;
        padding: 0vw 5vw;
        margin: 5vh 0vw;
        font-weight: 300;
    }

    input {
        border-radius: 3px;
        border: 1px solid rgba(211, 211, 211, 0.8);
        padding: 2%;
        width: 80vw;
    }

    input:focus {
        outline: none;
    }

    #saveNewEmail {
        border: 1px solid var(--primaryColor);
        color: var(--primaryColor);
        border-radius: 30px;
    }

    #saveNewEmail:active {
        background: var(--primaryColor);
        color: white;
        font-weight: 700;
    }

    #displayTitleAndButton {
        display: none;
    }

    @media only screen and (min-width: 768px) {

        p {
            padding: 0vw 15vw;
            font-size: 1.2rem;
        }

        input {
            width: 60vw;
            font-size: 1.2rem;
        }

        #saveNewEmail {
            margin-top: 2vh;
        }
    }

    @media only screen and (min-width: 1024px) {

        section {
            background: whitesmoke;
            display: grid;
            place-items: center;
        }

        form {
            width: 40%;
            box-shadow: 1px 5px 5px lightgrey;
            background: white;
            padding: 10vh 0vw 5vh 0vw;
            border-radius: 10px;
            row-gap: 40px;
            margin-top: 8vh;
        }

        p {
            font-size: 1rem;
            padding: 0vh 3vw;
            margin: 0vw;
        }

        input {
            width: 55%;
            padding: 1%;
        }

        input, #saveNewEmail {
            font-size: 0.9rem;
        }

        #saveNewEmail {
            width: 20%;
            padding: 8px;
            margin-top: 1vh;
        }

        #saveNewEmail:hover {
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