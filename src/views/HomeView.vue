<script setup>
import { onMounted, ref, computed } from "vue";
import { useProspectStore } from "@/stores/prospects";
import Navigator from "@/components/Navigator.vue";
import { initFlowbite } from "flowbite";
import TrackCard from "@/components/TrackCard.vue";
import { onBeforeMount, watch } from "vue";

const prospecStore = useProspectStore();
const prospects = ref(prospecStore.prospects);

watch(
  () => prospecStore.prospects,
  (newData) => {
    prospects.value = newData;
  }
);

function formatDate(date) {
  const formatteddate = new Date(date);
  return formatteddate.toISOString().split("T")[0];
}

const remarks = computed((prospect) => {
  return prospect.hasOwnProperty("remarks") ? prospect.remarks : " ";
});

const extractAndDownloadCSV = () => {
  try {
    console.log("running csv download");
    const today = new Date();
    const lastFriday = new Date(today);

    lastFriday.setDate(lastFriday.getDate() - ((today.getDay() + 2) % 7));

    const filteredData = prospects.value.filter(
      (prospect) =>
        prospect.status !== undefined &&
        prospect.updated_at !== undefined &&
        prospect.status !== "no-answer" &&
        formatDate(prospect.updated_at) === formatDate(today)
    );

    console.log("filteredData: ", filteredData);
    const extractedData = filteredData.map((prospect) => ({
      fullname: prospect.fullname,
      number: "233" + prospect.phone,
    }));

    console.log("extractedData: ", extractedData);

    const jsonBlob = new Blob([JSON.stringify(extractedData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "filtered_data.json");
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
  }
};

async function handleupdate() {
  let newArray = [];
  prospects.value.forEach((element) => {
    if (!element.hasOwnProperty("status")) {
      console.log(element);
      newArray.push(element);
    }
  });

  console.log(newArray);
  const data = {
    status: "unprocessed",
    processed: false,
  };

  await prospecStore.updateAllData(newArray, data);
}

const total = computed(() => {
  return prospects.value.length;
});

const processed = computed(() => {
  let newArray = [];
  prospects.value.forEach((element) => {
    if (element.hasOwnProperty("processed") && element.processed == true) {
      newArray.push(element);
    }
  });

  return newArray.length;
});

const unprocessed = computed(() => {
  let newArray = [];
  prospects.value.forEach((element) => {
    if (element.hasOwnProperty("processed") && element.processed == true) {
      newArray.push(element);
    }
  });

  return prospects.value.length - newArray.length;
});

const notInterested = computed(() => {
  let newArray = [];
  prospects.value.forEach((element) => {
    if (
      element.hasOwnProperty("status") &&
      element.status == "not-interested"
    ) {
      newArray.push(element);
    }
  });

  return newArray.length;
});

const interested = computed(() => {
  let newArray = [];
  prospects.value.forEach((element) => {
    if (element.hasOwnProperty("status") && element.status == "interested") {
      newArray.push(element);
    }
  });

  return newArray.length;
});

const subscribed = computed(() => {
  let newArray = [];
  prospects.value.forEach((element) => {
    if (element.hasOwnProperty("status") && element.status == "subscribed") {
      newArray.push(element);
    }
  });

  return newArray.length;
});

import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from "flowbite-vue";
import router from "../router";

onBeforeMount(() => {
  prospecStore.getAllProspects();
});

onMounted(() => {
  initFlowbite();
  prospecStore.getAllProspects();
});

const editInfo = (id) => {
  console.log("router triggered");
  router.push({
    name: "about",
    params: { id: id },
  });
};
</script>

<template>
  <main class="min-w-[100vh]">
    <nav class="fixed w-full shadow mb-5 bg-[#fbfafa] z-[100]">
      <div class="container">
        <div class="flex justify-between items-center">
          <img
            src="https://www.nahs.com.gh/wp-content/uploads/2023/06/NAHS-LOGO-pics-300x219-1.png.webp"
            alt=""
            width="120" />
          <div>
            <select
              name="filter"
              id="filter"
              class="border-2 border-gray-500 rounded-md p-2">
              <option value="" selected disabled>Filter Data</option>
              <option value="">Processed</option>
              <option value="">Unprocessed</option>
            </select>
          </div>
        </div>
      </div>
    </nav>

    <div class="container pl-5 pt-[7rem]">
      <Navigator />
    </div>

    <div class="py-10">
      <div class="container grid grid-cols-6 gap-5">
        <TrackCard
          title="Total"
          :value="total"
          @click="extractAndDownloadCSV" />
        <TrackCard title="Processed" :value="processed" @click="handleupdate" />
        <TrackCard title="Unprocessed" :value="unprocessed" />
        <TrackCard title="Interested" :value="interested" />
        <TrackCard title="Subscribed" :value="subscribed" />
        <TrackCard title="Uninterested" :value="notInterested" />
      </div>
    </div>
    <div class="h-full flex justify-center items-center py-[2rem]">
      <div class="container">
        <fwb-table hoverable class="w-full">
          <fwb-table-head>
            <fwb-table-head-cell class="text-center">Id</fwb-table-head-cell>
            <fwb-table-head-cell>Name</fwb-table-head-cell>
            <fwb-table-head-cell class="text-center">Phone</fwb-table-head-cell>
            <fwb-table-head-cell class="text-left">Remarks</fwb-table-head-cell>
            <fwb-table-head-cell class="text-left">Status</fwb-table-head-cell>
            <fwb-table-head-cell>
              <span class="sr-only">Edit</span>
            </fwb-table-head-cell>
          </fwb-table-head>
          <fwb-table-body>
            <fwb-table-row v-for="prospect in prospects" :key="prospect.id">
              <fwb-table-cell class="p-2 text-center">{{
                prospect.id
              }}</fwb-table-cell>
              <fwb-table-cell>{{ prospect.fullname }}</fwb-table-cell>
              <fwb-table-cell class="px-4"
                >0{{ prospect.phone }}</fwb-table-cell
              >
              <fwb-table-cell v-if="prospect.hasOwnProperty('remarks')">{{
                prospect.remarks
              }}</fwb-table-cell>
              <fwb-table-cell v-if="prospect.hasOwnProperty('status')">{{
                prospect.status
              }}</fwb-table-cell>
              <fwb-table-cell v-else class="text-red-500"
                >unprocessed</fwb-table-cell
              >
              <fwb-table-cell>
                <div
                  class="text-blue-400 font-semibold cursor-pointer"
                  @click="editInfo(prospect.id)">
                  Edit
                </div>
              </fwb-table-cell>
            </fwb-table-row>
          </fwb-table-body>
        </fwb-table>
      </div>
    </div>
  </main>
</template>
