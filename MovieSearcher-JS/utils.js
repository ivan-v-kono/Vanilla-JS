/**
  * @function getValue
  * @description                    Get value inputed or checked by user
  * @param  {String} selector       Selector or id of the input box or radio buttons group
  * @return {String} value          inputed/checked value
  */
export function getValue(selector) {
let value;
if (document.querySelector(selector) == null) {
    value = '';
} else value = document.querySelector(selector).value;
    return value;
}


/**
  * @function removeElement  
  * @description                        Removes an HTML element by removing its children
  * @param  {String} elementId          id of the element to be removed
  */
export function removeElement(elementId) {
    const elem = document.getElementById(`${elementId}`);
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}


/**
  * @function hideElement 
  * @description                        Hides the HTML element by adding the "hidden" attribute
  * @param  {String[]} [...args]        Array ID of those elements that will be shown
  */
export function hideElement(...args) {
    for (let elementId of args) {
        document.getElementById(`${elementId}`).setAttribute("hidden", '');
    }
}


/**
  * @function showElement
  * @description                        Displays an HTML element by removing the "hidden" attribute
  * @param  {String[]} [...args]        Array ID of those elements that will be shown
  */
export function showElement(...args) {
    for (let elementId of args) {
        document.getElementById(`${elementId}`).removeAttribute("hidden");
    }
}





