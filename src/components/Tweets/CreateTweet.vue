<template>
    <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="transparent" fab large v-bind="attrs" v-on="on" class="mx-sm-5 hidden-md-and-up">
                <v-icon class="hidden-sm-and-up">mdi-plus</v-icon>
                <v-icon size="40" class="hidden-xs-only">mdi-plus</v-icon>
            </v-btn>
            <v-btn :color="color" dark v-bind="attrs" v-on="on" class="mx-sm-5 hidden-sm-and-down">Create Tweet</v-btn>
        </template>
        <v-card class="text-center">
            <v-card-title>Create Post</v-card-title>
            <textarea id="tweetContent" cols="30" rows="10" placeholder="What's Happening?" class="ml-sm-n2"></textarea>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">Cancel</v-btn>
                <v-btn text @click="dialog = false; createUserTweet()">Post</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import axios from "axios";
    import cookies from "vue-cookies";

    export default {
        name: "create-tweet",

        data() {
            return {
                dialog: false,
                ownerData: cookies.get("userData"),
                createTweetStatus: "",
                imageAttachedToTweet: "",
                color: "#60A3D9"
            }
        },

        methods: {
            // Creating a function that creates a tweet
            createUserTweet() {
                // Printing a loading message
                this.createTweetStatus = "Sending Tweet";

                // If the user's tweet is greater than 200 characters or if the user attempts to post a tweet with no content, print an error message to the user
                if (document.getElementById("tweetContent").value.length > 200 || document.getElementById("tweetContent").value === "") {
                    this.createTweetStatus = "Invalid post.";
                } 
                
                // If the user's tweet is valid, send an axios request to create a new tweet
                else {
                    // Configuring the axios request with the url, type and data
                    axios.request({
                        url: `${process.env.VUE_APP_API_URL}/tweets`,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: {
                            loginToken: cookies.get("loginToken"),
                            content: document.getElementById("tweetContent").value,
                            imageUrl: cookies.get("userData").imageUrl
                        }
                    }).then((res) => {
                        // If the network is done and there are no errors, send the new tweet to the store
                        this.$store.commit("addTweetToPage", res.data);
                        this.createTweetStatus = "";
                    }).catch((err) => {
                        // If the network is done but the page errors, print an error message to the user
                        this.createTweetStatus = "Failed to send tweet.";
                        err;
                    });
                }
            },
        },
    }
</script>

<style scoped>
    textarea {
        width: 85%;
    }

    textarea:focus {
        outline: none;
    }

    @media only screen and (min-width: 768px) {

        textarea {
            width: 90%;
        }
    }

    @media only screen and (min-width: 1024px) {

        .v-btn {
            text-transform: capitalize;
        }
    }
</style>