<template>
    <Page class="page page--home c-black" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
      <GridLayout columns="*" rows="*, auto" height="100%">
        <VerticalScroll @nextPage="onNextPageTrack">
          <GridLayout class="" columns="*" rows="250, auto, *">
            <FlexboxLayout v-if="author.email" class="container container-fluid bg--top" width="100%" row="0" backgroundImage="~/assets/img/main_bg_clip.png">
              <StackLayout class="row" height="100%">
                <FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center" height="100%" @tap="logOut">
                  <Image class="author__img" :src="`https://api.adorable.io/avatars/200/${author.email}.png`"/>
                  <Label class="fz-24 my-2" :text="author.profile.name"/>
                  <!-- <Label class="fz-17" :text="author.followersCount"/> -->
                </FlexboxLayout>
              </StackLayout>
            </FlexboxLayout>


            <FlexboxLayout class="container container-fluid" width="100%" row="1">
              <StackLayout class="row">
                <HorizontalScroll @nextPage="onNextPagePlaylist" class="playlist-list">
                  <PlaylistButton
                    v-for="playlist of playlists"
                    :key="playlist._id"
                    :playlist="playlist"
                  />
                </HorizontalScroll>
              </StackLayout>
            </FlexboxLayout>
            
            <FlexboxLayout class="container container-fluid" width="100%" row="2">
              <StackLayout class="row">
                <TrackList :tracks="tracks"/>
              </StackLayout>
            </FlexboxLayout>

          </GridLayout>
        </VerticalScroll>

        <NavBottom activeIndex="3" />
        
      </GridLayout>
    </Page>
</template>

<script>
    import AthorService from '@/services/user';
    import PlaylistService from '@/services/playlist';
    import TrackService from '@/services/track';
    import Wellcome from '@/pages/Wellcome';

    export default {
      name: 'Author',
      props: {
        id: String
      },
      components: {
      },
      computed: {
      },
      data() {
        return {
          author: {
            profile: {},
            email: ''
          },
          playlists: [],
          tracks: []
        }
      },
      methods: {
        onNextPagePlaylist (page) {
          this.loadPlaylists(page);
        },
        onNextPageTrack (page) {
          this.loadTracks(page);
        },
        async loadAuthor () {
          try {
            const author = await AthorService.getAuthor({
              id: this.id
            });

            this.author = author.data.data;
          } catch (err)  {
            alert(err);
          }
        },
        async loadPlaylists (page = 1) {
          try {
            const playlists = await PlaylistService.getPlaylistsByAuthor({
              id: this.id,
              page
            });
            
            if (playlists.data)
              this.playlists = this.playlists.concat(playlists.data.data);
          } catch (err) {
            console.dir('--- err', err);
          }
        },
        async loadTracks (page = 1) {
          try {
            const tracks = await TrackService.getTracksByAuthor({
              id: this.id,
              page
            });
            
            if (tracks.data)
              this.tracks = this.tracks.concat(tracks.data.data);
          } catch (err) {
            alert(err);
          }
        },
        logOut () {
          this.$store.dispatch('setUser', {
            token: '',
            userId: ''
          }).then(() => {
            this.$goToPage(Wellcome);
          })
        }
      },
      async created () {
        await this.loadAuthor();
        this.loadPlaylists();
        this.loadTracks();
      }
    };
</script>

<style scoped lang="scss">
</style>
