<template>
    <section>
        <page-header-with-button title="Reply to Post"></page-header-with-button>
        <desktop-nav-bar></desktop-nav-bar>
        <!-- Display this section only if the viewport is 1024px or above -->
        <div id="displayTweetsDesktop" v-if="screensize >= 1024">
            <div id="tweetAndCreateComments">
                <div id="positionTweets">
                    <tweet-card :tweets="tweet"></tweet-card>
                </div>
                <create-comments :idOfTweet="Number(userTweetId)"></create-comments>
            </div>
            <div id="positionComments">
                <comment-card :comments="userComments" :tweetId="Number(userTweetId)"></comment-card>
            </div>
        </div>
        <div id="displayTweetsMobile" v-else>
            <tweet-card :tweets="tweet"></tweet-card>
            <comment-card :comments="userComments" :tweetId="Number(userTweetId)"></comment-card>
            <create-comments :idOfTweet="Number(userTweetId)"></create-comments>
        </div>
        <navigation-bar></navigation-bar>
    </section>
</template>

<script>
    import cookies from "vue-cookies";
    import axios from "axios";
    import PageHeaderWithButton from "../components/PageHeaderWithButton.vue";
    import TweetCard from "../components/Tweets/TweetCard.vue";
    import CreateComments from "../components/Comments/CreateComments.vue";
    import CommentCard from "../components/Comments/CommentCard.vue";
    import NavigationBar from "../components/NavigationBar.vue";
    import DesktopNavBar from "../components/DesktopNavBar.vue";

    export default {
        name: "Users-Tweet",

        data() {
            return {
                ownerData: cookies.get("userData"),
                tweet: [],
                screensize: window.innerWidth
            }
        },

        components: {
            PageHeaderWithButton,
            TweetCard,
            CreateComments,
            CommentCard,
            NavigationBar,
            DesktopNavBar
        },

        methods: {
            // Getting all tweets from the store
            getAllTweetsFromAPI() {
                this.$store.dispatch("getAllTweets");
            },

            // Sending a request from the store to get all comments on a single tweet
            getAllCommentsFromAPI() {
                this.$store.dispatch("getUserComments", this.userTweetId);
            },

            // Creating a function that will edit the user's comment
            updateTweet(data) {
                this.tweet[0].content = data.content;
            },

            // Creating a function that will store the size of the viewport as a variable
            handleResize() {
                this.screensize = window.innerWidth;
            }
        },

        computed: {
            // Getting the tweet id from the route
            userTweetId() {
                return this.$route.params.tweetId; 
            },

            // Getting comments from the store
            userComments() {
                return this.$store.state.userCommentsOnTweets;
            }
        },

        mounted() {
            // Checking to see if the tweet exists in the store
            let storeTweet = this.$store.state.allTweets.filter((singleTweet) => singleTweet.tweetId === this.$route.params.tweetId);
            // If the tweet does not exist, send an axios request to the specific tweet
            if(storeTweet.length === 0) {
                axios.request({
                    url: `${process.env.VUE_APP_API_URL}/tweets`,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    params: {
                        tweetId: this.userTweetId
                    }
                }).then((res) => {
                    res;
                    // If the network is done and there are no errors, store the returned data as a variable
                    this.tweet = res.data;
                }).catch((err) => {
                    err;
                });
            // If the tweet does exists, get the tweet from the store
            } else {
                this.tweet = storeTweet;
            }

            // When the page refreshes, get comments from the store
            this.getAllCommentsFromAPI();

            // Listening for when a tweet has been updated
            this.$root.$on("tweetIsUpdated", this.updateTweet);

            // Listening for when the viewport size has changed
            window.addEventListener("resize", this.handleResize);

            // If the user doesnt not have a login token, take the user to the Home page
            if(this.loginToken === null) {
                this.$router.push("/");
            }
        },
    }
</script>

<style scoped>
    #displayTweetsDesktop {
        display: none;
    }

    @media only screen and (min-width: 768px) and (max-width: 1024px) {

        section {
            margin-bottom: 20vh;
        }
    }

    @media only screen and (min-width: 1024px) {

        #displayTweetsMobile {
            display: none;
        }

        #displayTweetsDesktop {
            display: grid;
            place-items: center;
            grid-template-columns: 1fr 1fr;
            width: 100%;
            margin-top: 5vh;
        }

        #tweetAndCreateComments {
            display: grid;
            place-items: center;
            grid-template-rows: 1fr 1fr;
            width: 100%;
        }

        #positionComments {
            align-self: start;
            width: 100%;
        }

        #positionTweets {
            width: 42%;
            position: fixed;
            bottom: 33%;
            top: 5%;
        }

        section {
            display: grid;
            place-items: center;
            margin: 0vh 5vw;
        }
    }
</style>