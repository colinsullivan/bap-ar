const createAssetLoadingStatus = (id) => ({ id, loaded: false });

const beginLoadingAssets = (state) => {
  state.assetLoadingStatusById = {};
  /**
   *  Collects all a-frame asset items.
   **/
  const assetElements = document.querySelectorAll("a-asset-item");

  /**
   *  Loops over each a-frame asset item and creates a loading status object
   *  for tracking the loading status of each asset.
   **/
  for (const assetElement of assetElements) {
    const id = assetElement.getAttribute("id");
    assetLoadingStatusById[id] = createAssetLoadingStatus(id);

    /**
     *  When the asset is loaded, set the loaded status to true.
     **/
    assetElement.addEventListener("loaded", () => {
      assetLoadingStatusById[id].loaded = true;

      console.log("assetLoadingStatusById");
      console.log(assetLoadingStatusById);
    });
  }
};

/**
 * When document is loaded, starts up the AR app.
 */
document.addEventListener("DOMContentLoaded", () => {
  const state = {
    assetLoadingStatusById: {},
  };

  const foundOverlay = document.querySelector("#found-overlay");
  let entities = document.querySelectorAll("a-entity");
  let redirectUrl = "text.html";
  const poemDict = {
    p2: "i",
    p3: "i",
    p4: "i",
    p5: "i",
    p6: "i",
    p7: "i",
    p8: "i",
    p9: "ii",
    p10: "ii",
    p11: "iii",
    p12: "iv",
    p13: "v",
  };

  entities.forEach((entity) => {
    entity.addEventListener("targetFound", (event) => {
      console.log("target found");
      foundOverlay.classList.remove("hidden");
      let model = entity.querySelector("a-gltf-model");
      model.setAttribute("animation-mixer", "timeScale:1");
      let poem = model.getAttribute("src").split("-")[1].split(".")[0];
      redirectUrl = "text.html" + "#" + poemDict[poem];
    });
    entity.addEventListener("targetLost", (event) => {
      console.log("target lost");
      foundOverlay.classList.add("hidden");
      let model = entity.querySelector("a-gltf-model");
      entity.removeChild(model);
      createModel(entity, model.getAttribute("src"));
    });
  });

  function createModel(parent, src) {
    let newModel = document.createElement("a-gltf-model");
    newModel.setAttribute("rotation", "0 0 0");
    newModel.setAttribute("position", "0 0 0");

    // Get targetIndex from parent entity
    let targetIndex = parseInt(
      parent.getAttribute("mindar-image-target").split(":")[1].trim(),
    );

    // Set scale based on targetIndex
    if (targetIndex >= 7 && targetIndex <= 11) {
      newModel.setAttribute("scale", "2.55 2.55 2.55");
    } else if (targetIndex >= 1 && targetIndex <= 6) {
      newModel.setAttribute("scale", "2 2 2");
    }

    newModel.setAttribute("src", src);
    newModel.setAttribute(
      "animation-mixer",
      "loop:once;timeScale:0; clampWhenFinished: true;",
    );
    parent.appendChild(newModel);
  }
});
