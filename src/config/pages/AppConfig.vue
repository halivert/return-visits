<script setup lang="ts">
import ExportButton from "@/config/components/ExportButton.vue"
import ImportButton from "@/config/components/ImportButton.vue"
import OpenSourceLicenses from "../components/OpenSourceLicenses.vue"
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3 space-y-3">
		<section
			class="h-80 overscroll-contain overflow-y-scroll mx-auto bg-lemon-100 p-2"
		>
			<OpenSourceLicenses />
		</section>

		<section class="flex gap-3 justify-center">
			<ExportButton>Exportar datos</ExportButton>

			<ImportButton>Importar datos</ImportButton>
		</section>
	</main>
</template>
