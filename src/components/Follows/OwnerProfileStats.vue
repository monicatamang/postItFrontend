<template>
    <div id="statsContainer" v-if="userId">
        <div class="profileStats">
            <p>{{ displayFollowers }}</p>
            <p>Followers</p>
        </div>
        <div class="profileStats">
            <p>{{ displayFollows }}</p>
            <p>Following</p>
        </div>
    </div>
</template>

<script>
    import cookies from "vue-cookies";

    export default {
        name: "owner-profile-stats",

        data() {
            return {
                userId: cookies.get("userData").userId
            }
        },

        methods: {
            // Sending an axios request from the store to get the user's follows
            ownerFollows() {
                this.$store.dispatch("getOwnerFollows", this.userId);
            },

            // Sending an axios request from the store to get the user's followers
            getOwnerFollowersFromAPI() {
                this.$store.dispatch("getOwnerFollowers", this.userId);
            },
        },

        computed: {
            // Getting the number of users that account holder currently follows from the store and printing the number of follows to the page
            displayFollows() {
                return this.$store.state.displayOwnerFollows; 
            },

            // Getting the number of users that follows the account holder from the store and printing the number of followers to the page
            displayFollowers() {
                return this.$store.state.displayOwnerFollowers;
            }
        },

        mounted() {
            // If the page refreshes, get the user's follows and followers
            this.ownerFollows();
            this.getOwnerFollowersFromAPI();
        },
    }
</script>

<style scoped>
    #statsContainer {
        display: grid;
        place-items: center;
        grid-template-columns: 1fr 1fr;
        column-gap: 20px;
    }

    .profileStats {
        display: grid;
        place-items: center;
        grid-template-columns: auto 1fr;
        column-gap: 10px;
    }

    p {
        font-size: 0.95rem;
        font-weight: 400;
    }

    .v-application p {
        margin-bottom: 0px;
    }

    @media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {

        p {
            font-size: 1.2rem;
        }
    }

    @media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {

        p {
            font-size: 1.1rem;
        }
    }

    @media only screen and (min-width: 1025px) {

        p {
            font-size: 0.7rem;
            color: black;
        }        
    }
</style>