<template>
  <div style="text-align: left">
    <h2 style="text-align: center">Changelog 2.2.x</h2>
    <b>Features</b>
    <ul>
      <li>Add a config to choose if the app should update a mod in the current folder or not</li>
      <li>The app now checks for zip files in Mods folder and will show you an issue if one is found</li>
      <li>You can now filter search result by provider=patreon</li>
      <li>Triplis mods are now indexed</li>
      <li>Kuttoe mods are now indexed</li>
      <li>20th Century Plumbob mods are now indexed</li>
      <li>IlexSims mods are now indexed</li>
      <li>NC4T mods are now indexed</li>
      <li>MizoreYukii mods are now indexed</li>
      <li>Thepancake1 And MizoreYukii mods are now indexed</li>
    </ul>
    <b>Fixes</b>
    <ul>
      <li>Installs and "mark mod as outdated button" are shown faster now</li>
      <li>Fix issue where the app could detect all your files as duplicates when Mods and Tray folders points to the same folder (which is a wrong configuration)</li>
      <li>Fix UI display on mod detail screen with large images included in the description</li>
      <li>Fix error shown while removing, editing, disabling and enabling some mods</li>
    </ul>
    <b>Others</b>
    <ul>
      <li>Reduce app size</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Changelog20100"
}
</script>
