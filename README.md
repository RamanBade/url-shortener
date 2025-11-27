# URL - SHORTENER

The purpose of my URL Shortener project is to allow users to easily convert long and complex web links — for example, 15 or 20 characters long with numbers, and even longer — into short, shareable, and copyable links.

After entering the URL into the “Enter your URL” field and clicking the Shorten button the system generates a 6-character short code and appends it to the original link end.

Then it moves to the Short-URL section and when the code is clicked the user is redirected to the main or related target site.

Each time a short link is clicked the click count automatically increases by +1, the bar chart updates, and the user is redirected to the original website.

Additionally, all links are displayed in the analytics table in real time allowing the user to easily copy them or open them in a new tab, new window, or incognito window.


![Url Shortener Screenshot](screenshots/Main-Url-Shortener.png)

![Url Shortener Screenshot](screenshots/2-Main-Url-Shortener.png)




<br><br>




# COPY & REDIRECT LOGIC



On the Click Analytics page when you generate a short link for a website such as https://www.instagram.com/

the system creates a 6‑character short code (example: ZoCZdZ).

When the user clicks the Copy button the platform produces a short URL like: http://127.0.0.1:5000/ZoCZdZ



Although this URL may look like it belongs to Instagram or another target website it actually belongs to the URL Shortener platform itself.


Here:

http://127.0.0.1:5000/ → Mine the domain of the URL Shortener application

ZoCZdZ → the 6‑character code generated for Instagram’s original long link



When the user clicks the short link they are automatically redirected to the original destination whether it is Instagram’s homepage or any other subpage.


This redirect mechanism works the same for all websites:


1- The platform receives a long URL,

2- Generates a unique 6‑character code,

3- Appends this code to its own domain,

4- Redirects the user to the real target URL.


This makes long and complex links much shorter, shareable, and easier to track through the analytics table.


![Url Shortener Screenshot](screenshots/Url-Shortener-copy.png)



<br><br>





# SHORT-URL WORK FLOW 


After clicking the 6‑character code in the Short-URL section the user is redirected to the main or sub page of Instagram (or any other website) based on the generated 6‑character code.

![Url Shortener Screenshot](screenshots/Short-Url.png)


<br><br>







# TOTAL CLICKS WORK FLOW



After clicking the system through the combined operation of the jQuery frontend and backend functions increments the click count by +1. This updated value is immediately reflected in the total clicks. 

If desired the short link can also be opened in a new tab, new window, or incognito window and the functions will work in all cases gives the +1 values.



![Url Shortener Screenshot](screenshots/Total-Clicks.png)



<br><br>







# REMOVE ORIGINAL URL WORKFLOW



In the admin panel you can optionally select and remove any shortened website from the original URL list whether by its long URL or its six-character short code.

This operation is performed using our delete_urls.py file. By adding the desired websites to the urls_to_delete list the selected URLs will be removed from the panel.




Remove-Panel.png  ![Url Shortener Screenshot](screenshots/Remove-Panel.png)



<br><br>
