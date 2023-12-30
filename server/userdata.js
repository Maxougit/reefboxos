import fs from "fs/promises";

const listFavorites = async () => {
  try {
    const data = await fs.readFile("./server/data.json", "utf8");
    return await JSON.parse(data).favourite_device; // Assurez-vous que 'favorite_device' est le bon chemin dans votre JSON
  } catch (err) {
    console.error(err);
    return; // ou retournez une valeur par défaut ou une erreur
  }
};

const addFavorite = async (favorite) => {
  try {
    const data = await fs.readFile("./server/data.json", "utf8");
    const favorites = JSON.parse(data).favourite_device;
    favorites.push(favorite);
    await fs.writeFile(
      "./server/data.json",
      JSON.stringify({ favourite_device: favorites })
    );
    return favorites;
  } catch (err) {
    console.error(err);
    return; // ou retournez une valeur par défaut ou une erreur
  }
};

const removeFavorite = async (favorite) => {
  try {
    const data = await fs.readFile("./server/data.json", "utf8");
    const favorites = JSON.parse(data).favourite_device;
    console.log(favorites, favorite);
    const updatedFavorites = favorites.filter((fav) => fav !== favorite);
    console.log(updatedFavorites);
    await fs.writeFile(
      "./server/data.json",
      JSON.stringify({ favourite_device: updatedFavorites })
    );
    return updatedFavorites;
  } catch (err) {
    console.error(err);
    return; // ou retournez une valeur par défaut ou une erreur
  }
};

export { listFavorites, addFavorite, removeFavorite };
