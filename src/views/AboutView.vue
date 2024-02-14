<template>
  <div class="h-screen">
    <div class="container flex justify-center items-center h-full">
      <div class="w-full">
        <Navigator class="mb-3" />

        <div class="flex justify-between gap-10">
          <div
            class="border-2 border-gray-500 p-8 rounded-md flex flex-col gap-4">
            <h3 class="font-semibold mb-2">Prospect Details</h3>
            <p class="font-medium">
              Id: <span class="font-normal">{{ info?.id }}</span>
            </p>
            <p class="font-medium">
              Name: <span class="font-normal">{{ info?.fullname }}</span>
            </p>
            <p class="font-medium">
              Phone: <span class="font-normal">0{{ info?.phone }}</span>
            </p>
            <p class="font-medium">
              Ministry: <span class="font-normal">{{ info?.ministry }}</span>
            </p>
            <p class="font-medium">
              Department:
              <span class="font-normal">{{ info?.department }}</span>
            </p>
            <p class="font-medium">
              Remarks:
              <span class="font-normal" >{{ info?.remarks }}</span>
            </p>
          </div>
          <div class="border-2 border-gray-500 p-8 rounded-md w-full">
            <form action="" class="flex flex-col gap-4" @submit.prevent>
              <input type="text" name="name" id="name" v-model="name" />
              <select
                name="status"
                id="status"
                class="rounded"
                v-model="status">
                <option value="" selected disabled>Select status</option>
                <option value="first-call">First Call</option>
                <option value="follow-up">Follow Up</option>
                <option value="no-answer">No Answer</option>
                <option value="interested">Interested</option>
                <option value="not-interested">Not Interested</option>
                <option value="visiting">Visiting</option>
                <option value="subscribed">Subscribed</option>
              </select>
              <label for="">Remarks: </label>
              <textarea
                v-model="remarks"
                class="rounded"
                name="remarks"
                id="remarks"
                cols="30"
                rows="10"></textarea>
              <button
                class="bg-blue-400 text-white p-2 rounded"
                @click="handleSubmit">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

<script setup>
import { onMounted, ref } from "vue";
import { useProspectStore } from "@/stores/prospects";
import { useRoute } from "vue-router";
import Navigator from "@/components/Navigator.vue";
import router from "@/router";
const status = ref("");

const prospectId = ref("");

const prospecStore = useProspectStore();
const info = ref(null);
const name = ref("");
const remarks = ref("");

const handleSubmit = () => {
  const updatedFields = {
    status: status.value,
    remarks: remarks.value,
    processed: true,
    updated_at: new Date(),
    fullname: name.value,
  };

  console.log(prospectId.value, updatedFields);
  prospecStore.updateProspectInfo(prospectId.value, updatedFields)
  router.push("/")
};

onMounted(async () => {
  const route = useRoute();

  const id = route.params.id;
  prospectId.value = id;
  const data = await prospecStore.getProspectInfo(id);
  info.value = data;
  name.value = data.fullname;
  remarks.value = data.remarks
  console.log(data);
});
</script>
