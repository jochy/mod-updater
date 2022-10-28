<template>
  <div style="text-align: left">
    <h2 style="text-align: center">Changelog 2.1.x</h2>
    <b>Features</b>
    <ul>
      <li>You can now rename all your mods' folder name with the folder pattern name</li>
      <li>Speedup page loading by loading images asynchronously</li>
      <li>You can now see how many times a mod has been installed using Sims Mods Updater</li>
      <li>You can now mark mods as outdated, and see how many users marked it as outdated</li>
    </ul>
    <b>Fixes</b>
    <ul>
      <li>Fix wrong error displayed after installing a mod when the app couldn't remove an empty folder</li>
      <li>Fix issues while downloading dependencies during startup</li>
      <li>Fix some minor errors (mostly the one that are not seen by you but reported to me)</li>
      <li>Fix app won't start on some Mac</li>
      <li>Fix tag input color in Mods screen when using the dark theme</li>
      <li>Fix a case where all mods could be moved to the root folder</li>
      <li>Fix small UI issues with the website and mobile browsers</li>
    </ul>
    <b>Others</b>
    <ul>
      <li>Upgrade all dependencies to their latest versions</li>
      <li>Rework Mods suggestion (previous system wasn't enough performant)</li>
      <li>Small performance improvement on Mods screen</li>
      <li>Small UI adjustments</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Changelog20100"
}
</script>
