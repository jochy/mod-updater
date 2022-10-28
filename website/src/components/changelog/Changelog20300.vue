<template>
  <div style="text-align: left">
    <h2 style="text-align: center">Changelog 2.3.x</h2>
    <b>Features</b>
    <ul>
      <li>You can now enable versioning system: the app will record every changes made in your mods; you will be able to revert them. <b>You will need to enable versioning in the Settings.</b></li>
      <li>Better behavior while moving files after an update: the app now moves only checked files and not all files located in any subfolders</li>
    </ul>
    <b>Fixes</b>
    <ul>
      <li>Fix a condition where the app could delete all mods in a folder when you have 1 folder for all mods</li>
      <li>Fix dark mode background color</li>
      <li>Fix tray folder existence before saving settings</li>
      <li>Prevent multiple apps at the same time</li>
      <li>Removes useless space at the end of new folder</li>
    </ul>
    <b>Others</b>
    <ul>
      <li>Speed up app starting</li>
      <li>Reduce app size</li>
      <li>Reduce website size</li>
      <li>Speedup mods indexing</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Changelog20300"
}
</script>
