import router from '../router/index';
<script lang="ts" setup></script>

<template>
  <div class="video-wrapper">
    <video autoplay muted loop playsinline class="background-video">
      <source src="/video2.mp4" type="video/mp4" />
    </video>
    <div class="page-body">
      <h1>404 NOT FOUND HAHAHAHAHHHA</h1>
      <div class="router-link">
        <router-link to="/">Go back</router-link>
      </div>

      <button class="hidden-button">HI HAHAAHHAHA</button>
    </div>
  </div>
</template>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

.page-body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
  flex-wrap: wrap;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  z-index: 1;
}
h1 {
  font-size: 80px;
}
.router-link {
  font-size: 100px;
  text-decoration: none;
}
</style>
