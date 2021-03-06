<template>
    <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">Delete</v-btn>
        </template>
        <v-card class="text-center">
            <v-card-title>Delete Post</v-card-title>
            <v-card-text>Are you sure you want to permanently remove this post?</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">Cancel</v-btn>
                <v-btn text @click="dialog = false; deleteUserTweet()">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import axios from "axios";
    import cookies from "vue-cookies";

    export default {
        name: "delete-tweet",

        props: {
            userTweetId: Number
        },

        data() {
            return {
                dialog: false,
                deleteTweetStatus: ""
            }
        },

        methods: {
            // Getting all the tweets from the store
            getAllTweets() {
                this.$store.dispatch("getAllTweets");
            },

            // Creating a function that deletes a user's tweet
            deleteUserTweet() {
                // Printing a loading message
                this.deleteTweetStatus = "Deleting";
                // Configuring the axios request with the url, type and data
                axios.request({
                    url: `${process.env.VUE_APP_API_URL}/tweets`,
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        loginToken: cookies.get("loginToken"),
                        tweetId: this.userTweetId
                    }
                }).then((res) => {
                    // If the network is done and no errors occur, delete the from the store by sending the index of the deleted tweet in the array of allTweets
                    for(let i = 0; i < this.usersTweets.length; i++) {
                        if(this.usersTweets[i].tweetId === this.userTweetId) {
                            this.$store.commit("deleteTweetOnPage", i);
                        }
                    }
                    // Notifying the TweetCard component that the tweet has been deleted, don't call API to get TweetLikes
                    this.$emit("tweetIsDeleted", true);
                    // Taking the user back to the previous page
                    this.$router.go(-1);
                    res;
                }).catch((err) => {
                    err;
                    // If the network is done and page errors, print an error message to the user
                    this.deleteTweetStatus = "Failed to delete tweet.";
                });
            }
        },

        computed: {
            usersTweets() {
                return this.$store.state.allTweets;
            }
        }
    }
</script>

<style scoped>
    @media only screen and (min-width: 768px) {
        
        .v-card__text {
            font-size: 1.1rem;
        }
    }
</style>