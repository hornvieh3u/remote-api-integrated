<template>
    <div class="login">
        <header id="header-component" class="header">
            <nav class="navbar nav-pills nav-fill sticky-top">
            <div class="container-fluid">
                <a id="nav-brand" class="navbar-brand" href="https://cloud.mpa-secure.com">
                <img src="https://storage.googleapis.com/mpa-sites/graphics/logos/org/logo-flow.png" alt="Logo" class="d-inline-block" height="35">
                </a> 
            </div>
            </nav>
        </header>
        <div id="prompt" class="prompt"></div>

        <loader id="loader-component" class="loader" v-if="loading === true">
            <div class="align-items-center" role="status"><img src="https://storage.googleapis.com/mpa-sites/graphics/loaders/loader-mpa.gif"></div>
        </loader>
        <main class="bg-light" v-else>
            <div id="content" class="raised">
                <div id="row-login" class="row p-3 mt-4 g-4" v-if="!user">
                    <div class="col-auto p-2 mx-auto">
                        <h4 class="col-auto col-12 p-1 text-primary">
                            Login / Register
                        </h4>
                        <h6 class="col-auto col-12 p-2 text-light bg-primary">
                            Keeping the flow
                        </h6>
                    </div>
                    <div class="col-auto p-3 mx-auto">
                        <div class="col-auto col-12 p-2">
                            <div id="button-signin">
                                <GoogleLogin :callback="callback"/>
                            </div>
                        </div>
                        <small class="col-auto col-12 p-2">
                            <span class="text-secondary p-2">
                                Don't have an account?
                            </span>
                            <a class="text-primary p-1" href="#" target="_blank" rel="noopener noreferrer">
                                Register here.
                            </a>
                        </small>
                    </div>
                </div>
                <div id="form-verify-identity" class="login" v-else>
                    <form class="row p-2 g-3" novalidate="">
                        <div class="col-1 col-auto">
                            <div class="form-floating">
                                <span id="lock-person" class="h4 mb-1 font-weight-normal material-symbols-outlined">lock_person</span>
                            </div>
                        </div>
                        <div class="col-10 col-auto">
                            <div class="form-floating">
                                <span class="h4 mb-1 font-weight-normal">Verify Identity</span>
                            </div>
                        </div> 
                        <div class="col-12 col-auto">
                            <div id="group-email" class="form-floating">
                                <input id="input-email" type="email" class="form-control" minlength="2" required="" disabled="" :value="user.email" >
                                <label for="input-email">Email</label> 
                                <div class="invalid-tooltip">
                                    Invalid email. Reload the page.
                                </div>
                                
                            </div>
                        </div>
                    
                        <div class="col-12 col-auto">
                            <div id="group-address" class="form-floating">
                                <input id="input-address" type="text" class="form-control pac-target-input is-invalid" v-model="address" data-filter="^[0-9]" minlength="2" required="" placeholder="Enter a location" autocomplete="off" wfd-id="id1">
                                <label for="input-address">Primary Residence Address</label>
                                
                                <span id="icon-address" class="material-symbols-outlined text-success gtfo">verified_user</span>
                                <small id="details-address" class="text-success"></small> 
                            </div>
                        </div>  
                        <div class="col-12 col-auto mb-3 opt gtfo">
                            <button id="button-form" type="submit" class="btn-primary mt-0 mb-4 align-items-center text-center g-recaptcha" disabled="true">New Initial Request</button>
                        </div>
                    </form>
                </div>
            </div>
            <div id="offcanvas-menu" class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" aria-labelledby="label-menu">
                <div class="offcanvas-header">
                    <h4 id="label-menu" class="offcanvas-title">
                        menu
                    </h4>
                    <button id="btn-close-menu" class="material-symbols-outlined text-primary bg-light" data-bs-dismiss="offcanvas">close</button>
                </div>
                <div class="offcanvas-body">
                
                </div>
            </div>
        </main>
        <footer id="footer-component" class="footer">
            <div class="row align-items-center justify-content-around">
            <div class="col-auto col-3 text-nowrap">
                <span>© 2023 MPA, Inc.</span>
            </div>
            <div class="col-auto col-3 text-nowrap">
                <a href="mailto:support@mpa-secure.com?subject=General%20Support" target="_blank" rel="noopener noreferrer">
                    Support
                </a>
            </div>
            <div class="col-auto col-3 text-nowrap">
                <a href="https://policies.mpa-secure.com/" target="_blank" rel="noopener noreferrer">
                    Policies
                </a>
            </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router';
    import { decodeCredential } from 'vue3-google-login'
    import { toast } from 'vue3-toastify'

    import '../../assets/css/login.css'
    
    const router = useRouter();
    const loading = ref(true)
    const user = ref(null)
    const address = ref('');

    onMounted(() => {
        setTimeout(() => loading.value = false, 2500)
    })

    const callback = response => {
        user.value = decodeCredential( response.credential )
        localStorage.setItem("user", JSON.stringify({ token: response.credential }))
        toast.success('Welcome to DL DocAI')
        router.replace( '/' )
    }
</script>

<style>
* {
    box-sizing: border-box;
    font-family: Roboto;
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none; /* For Internet Explorer and Edge */
}
  
*::-webkit-scrollbar {
    width: 0px; /* For Chrome, Safari, and Opera */
}
  
body .abcRioButton{
    box-shadow: none; 
    border: 1px solid #dadce0;
    outline: none;
    font-weight: bold;
}
body .abcRioButton:hover{
    border-color: #d2e3fc;
    box-shadow: none;
    background-color: #f7faff;
}
body .abcRioButtonContents{
    font-weight: bold;
}
@font-face {
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v91/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1n-q_4MrImHCIJIZrDCvHOej.woff2) format('woff2');
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
</style>