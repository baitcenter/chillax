<template>
    <Page class="page page--home bg bg--cream c-white" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
      <ScrollView class="panel panel--home" orientation="vertical">
        <GridLayout columns="*" rows="*, auto" width="100%" height="100%">

          <FlexboxLayout class="form__top container bg bg--clip" width="100%" row="0">
            <StackLayout class="row text-center" height="100%">
              <FlexboxLayout alignItems="center" justifyContent="center" height="100%" width="100%">
                <Image src="~/assets/img/logo.png"/>
              </FlexboxLayout>
            </StackLayout>
          </FlexboxLayout>

          <FlexboxLayout class="form__bottom container pb-4" width="100%" row="1">
            <StackLayout class="row text-center">
              <Button class="close my-fa" text.decode="&#xe801;" @tap="$goToPage(Wellcome)" />

              <TextField class="field" v-model="email" hint="email" keyboardType="email" @focus="clearErrors('email')"/>
              <Label class="error error--field" :text="errors.email" />

              <TextField class="field" v-model="password" hint="password" :secure="true" @focus="clearErrors('password')"/>
              <Label class="error error--field" :text="errors.password" />

              <Button class="btn green shadow" text="Sign in" @tap="onLogin" />
              
              <Label class="mt-2 new-account" text="New Account?" @tap="$goToPage(Registration)" />
            </StackLayout>
          </FlexboxLayout>
          
        </GridLayout>
      </ScrollView>
    </Page>
</template>

<script>
    import Wellcome from '@/pages/Wellcome';
    import Home from '@/pages/Home';
    import Registration from '@/pages/Registration';
    import AuthService from '@/services/auth';

    export default {
        name: 'Login',
        computed: {
        },
        data() {
          return {
            Wellcome,
            Home,
            Registration,

            email: 'test@gmail.com',
            password: '12345',
            errors: {
              email: '',
              password: ''
            }
          }
        },
        methods: {
          clearErrors (field) {
            if (field) {
              this.$set(this.errors, field, '');
            } else {
              this.errors = {
                email: '',
                password: ''
              };
            }
          },
          async onLogin () {
            try {
              this.clearErrors();

              const response = await AuthService.login({
                email: this.email,
                password: this.password
              });

              this.$store.dispatch('setUser', {
                token: response.data.token,
                userId: response.data.data._id
              })
                .then(() => {
                  this.$goToPage(Home);
                });
            } catch (err) {
              if (err.response && err.response.data && typeof err.response.data.message == 'object') {
                for (const e of err.response.data.message) {
                  this.$set(this.errors, e.field, e.message);
                }
              } else {
                alert(err);
              }
            }
          }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
    .form__top {
      margin-bottom: -20;
    }

    .new-account {
      color: $black;
    }
</style>
