const searchBox = document.querySelector('.search__box');
const input = searchBox.querySelector('.search__box input');
const autocomplite = searchBox.querySelector('.autocomplete');
const errorMessage = searchBox.querySelector('.error-message');
const screenCollection = [];

const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

class Component {
  constructor(obj) {
    this.name = obj.name;
    this.owner = obj.owner.login;
    this.stars = obj.stargazers_count;
  }

  toScreen(array) {
    const fragment = document.createDocumentFragment();

    array.forEach(item => {
      const card = document.createElement('div');
      const cardInfos = document.createElement('div');
      const cardDelete = document.createElement('div');
      const cardName = document.createElement('p');
      const cardOwner = document.createElement('p');
      const cardStars = document.createElement('p');

      cardName.textContent = `Name: ${item.name}`;
      cardOwner.textContent = `Owner: ${item.owner.login}`;
      cardStars.textContent = `Stars: ${item.stargazers_count}`;

      const btn = document.createElement('button');
      btn.classList.add('close');
      const span = document.createElement('span');
      span.classList.add('close_span');
      btn.appendChild(span);
      btn.appendChild(span.cloneNode(true));
      btn.addEventListener('click', () => {
        card.remove();
      });

      cardInfos.appendChild(cardName);
      cardInfos.appendChild(cardOwner);
      cardInfos.appendChild(cardStars);
      cardDelete.appendChild(btn);

      cardInfos.classList.add('card-flexbox-start');
      cardDelete.classList.add('card-flexbox-end');

      card.appendChild(cardInfos);
      card.appendChild(cardDelete);

      card.classList.add('choose-card');
      fragment.appendChild(card);
      searchBox.appendChild(fragment);
    });
  }
}

async function getRepo(repoName) {
  try {
    const data = await fetch(`https://api.github.com/search/repositories?q=${repoName}&per_page=5`);
    const response = await data.json();
    return response.items;
  } catch (error) {
    throw new Error('error');
  }
}

function showResults(arr) {
  autocomplite.textContent = '';
  autocomplite.style.display = 'block';

  if (arr.every(obj => obj.length === 0)) {
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
    arr.forEach(obj => {
        const repoInfo = document.createElement('div');
        repoInfo.textContent = obj.name;
        repoInfo.classList.add('show-results');
        repoInfo.addEventListener('click', () => {
          const screenCollection = [];
          screenCollection.push(obj);
          const component = new Component(obj);
          component.toScreen(screenCollection);
          input.value = '';
          autocomplite.style.display = 'none';
        });
        autocomplite.appendChild(repoInfo);
    });
  }
}

input.addEventListener('input', debounce(async (e) => {
  const query = e.target.value;
  if (query) {
    const repos = await getRepo(query);
    showResults(repos);
  } else {
    autocomplite.textContent = '';
  }
}, 400));