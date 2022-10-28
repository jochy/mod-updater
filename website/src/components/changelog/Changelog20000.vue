<template>
  <div style="text-align: left">
    <h2 style="text-align: center">Changelog 2.0.x</h2>
    <b>Features</b>
    <ul>
      <li>There is now a dark theme, which is active by default ; if you want you can use the switch on the topbar to get back to light theme</li>
      <li>Delete empty folders after installation or removal</li>
      <li>You can now configure the pattern for folders' name created by the app</li>
      <li>When you update a mod, new files are now moved to the same folder as previous one, instead of creating a new folder</li>
      <li>There is now a mod suggestion on mods detail (may take some time to be accurate)</li>
      <li>You can now disable hardware acceleration in settings</li>
      <li>There is now a status page which tracks every components used by the system. You will receive a notification when a component is down or when all become available</li>
      <li>Lumpinou's mods are now indexed</li>
    </ul>
    <b>Fixes</b>
    <ul>
      <li>Fix mods not well installed when the mod folder isn't on the main storage drive</li>
      <li>Fix useless files not removed after installation if there were not checked</li>
      <li>Fix simrealist update tracking on some mods</li>
      <li>Fix updates not well tracked on some mods from TSR</li>
      <li>Fix issues preventing app from starting</li>
      <li>Fix some minor issues while installing / upgrading a lot of mods at the same time</li>
    </ul>
    <b>Others</b>
    <ul>
      <li>Website errors are now reported to me</li>
      <li>Add some help in settings menu</li>
      <li>Improve performance on mods screen (still have work to do, but this is a huge improvement x20 faster with 2000 mods)</li>
      <li>Reduce wrong file detection</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Changelog20000"
}
</script>
