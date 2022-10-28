<template>
  <div style="text-align: left">
    <h2 style="text-align: center">Changelog 1.13.x</h2>
    <b>Features</b>
    <ul>
      <li>Now automatically retries after a download failure</li>
      <li>Force user to have read and write rights on mods after installing them</li>
      <li>You can now disable the update popup</li>
      <li>You can now exclude tags from search</li>
      <li>Mods from nexusmods are now indexed</li>
      <li>Mods from SrslySims are now indexed</li>
    </ul>
    <b>Fixes</b>
    <ul>
      <li>Fix Kawaistacie mods update tracking</li>
      <li>Fix app won't start when browser policies are forcing the use of extensions</li>
      <li>Fix app freezing at screen "Checking issue with duplicate files"</li>
      <li>Fix app freezing after some issues while checking update</li>
      <li>Fix mods removed after a failing update: if there is an issue while updating the mod, previous files will be restored</li>
      <li>Fix cache not properly updated after a mod update</li>
      <li>Fix performance issue after installing a mod from the search menu</li>
    </ul>
    <b>Others</b>
    <ul>
      <li>Reduce TSR download time and failure</li>
      <li>File watchers are disabled due to issues on some computers</li>
      <li>Rework ads : static places with ads and remove almost ads everywhere else</li>
      <li>Global performance improvements</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Changelog1130"
}
</script>
