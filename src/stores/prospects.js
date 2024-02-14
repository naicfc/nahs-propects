import { defineStore } from "pinia";

export const useProspectStore = defineStore("prospects", {
  state: () => ({ prospects: [] }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    getProspectInfo(id) {
      return fetch(`http://localhost:3000/prospects/${id}`)
        .then((response) => response.json())
        .then((post) => {
          console.log("Single Post:", post);
          return post;
        })
        .catch((error) => {
          console.error("Error getting post:", error);
        });
    },
    updateProspectInfo(id, updatedPostData) {
      fetch(`http://localhost:3000/prospects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPostData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Post updated with new fields and updated values:", data);
        })
        .catch((error) => {
          console.error("Error updating post:", error);
        });
    },
    async updateAllData(resources, data) {
      console.log("running");
      const updatePromises = resources.map((resource) => {
        return fetch(`http://localhost/prospects/${resource.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      });

      await Promise.all(updatePromises);
    },
    getAllProspects() {
      fetch("http://localhost:3000/prospects")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.prospects = data;
        })
        .catch((error) => console.error("Error fetching data:", error));
    },
  },
  persist: true,
});
