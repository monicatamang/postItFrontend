<template>
    <section>
        <page-header-with-button title="Password"></page-header-with-button>
        <div id="displayTitleAndButton">
            <back-button></back-button>
            <h1>Password</h1>
            <div></div>
        </div>
        <v-divider class="hidden-md-and-up"></v-divider>
        <form action="javascript:void(0)">
            <p>Please enter your new password.</p>
            <h6>New password must be a minimum of 12 characters</h6>
            <input type="password" id="newPassword" placeholder="New Password">
            <button @click="updateAccountPassword" id="saveButton">Save</button>
            <p>{{ updatePasswordStatus }}</p>
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
        name: "Update-Password",

        components: {
            PageHeaderWithButton,
            NavigationBar,
            BackButton
        },

        data() {
            return {
                userAccountData: cookies.get("userData"),
                updatePasswordStatus: "",
                updateUserPassword: {
                    loginToken: cookies.get("loginToken")
                },
            }
        },

        methods: {
            // Creating a function that will update a user's password
            updateAccountPassword() {
                // Printing a loading message
                this.updatePasswordStatus = "Saving";
                
                // Updating the value of the user's password to the new password they entered into the input field
                if (document.getElementById("newPassword").value !== null) {
                        this.updateUserPassword.password = document.getElementById("newPassword").value;
                }

                // Configuring the axios request with the url, type and new password
                axios.request({
                    url: `${process.env.VUE_APP_API_URL}/users`,
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: this.updateUserPassword
                }).then((res) => {
                    // If the network is done and there are no errors, update the user's cookie
                    let updateAccountData = JSON.stringify(res.data);
                    cookies.set("userData", updateAccountData);
                    // Taking the user back to the previous page
                    this.$router.go(-1);
                }).catch((err) => {
                    // If the network is done and page errors, print an error message to the user
                    this.updatePasswordStatus = "An error occured while trying to save your changes.";
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

    p {
        font-size: 0.95rem;
        text-align: center;
    }

    h6 {
        margin-top: -1vh;
    }

    form {
        display: grid;
        place-items: center;
        row-gap: 30px;
        margin-top: 5vh;
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

    #saveButton {
        border: 1px solid var(--primaryColor);
        padding: 2.5%;
        color: var(--primaryColor);
        border-radius: 30px;
        width: 80vw;
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

        p {
            padding: 0vw;
            font-size: 1.2rem;
            font-weight: 300;
        }

        input, #saveButton {
            width: 60vw;
            font-size: 1.2rem;
        }

        #saveButton {
            padding: 2%;
            margin-top: 1vh;
        }
    }

    @media only screen and (min-width: 768px) {

        p {
            padding: 0vw;
            font-size: 1.2rem;
            font-weight: 300;
        }

        h6 {
            font-size: 1rem;
        }

        input, #saveButton {
            width: 60vw;
            font-size: 1.2rem;
        }

        #saveButton {
            padding: 2%;
            margin-top: 1vh;
        }
    }

    @media only screen and (min-width: 1024px) {

        section {
            background: whitesmoke;
            display: grid;
            place-items: center;
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

        form {
            width: 40%;
            box-shadow: 1px 5px 5px lightgrey;
            background: white;
            padding: 10vh 0vw 6vh 0vw;
            border-radius: 10px;
            row-gap: 40px;
            margin-top: 8vh;
        }

        h1 {
            font-size: 1.2rem;
            font-weight: 400;
        }

        p {
            font-size: 1rem;
        }

        h6 {
            font-size: 0.8rem;
        }

        input, #saveButton {
            font-size: 0.8rem;
        }

        input {
            width: 55%;
            padding: 1%;
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
    }
</style>