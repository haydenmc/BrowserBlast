using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HtmlAgilityPack;
using System.Web.Http;

namespace BrowserBlast.Controllers
{
    public class RelayController : Controller
    {
        // GET: Relay
        public ActionResult Index(String url)
        {
			//bla bla bla darren still smells
            //TODO: check valid url
			HtmlWeb web = new HtmlWeb();
			HtmlDocument doc = web.Load("http://" + url);
			var root = doc.DocumentNode;

			// Kill all of the JS
			var jsNodes = root.SelectNodes("//script");
			foreach (var jsNode in jsNodes)
			{
				jsNode.Remove();
			}

			// Inject JS into the head node
			var headNode = root.SelectSingleNode("//head");
			var scriptNode = doc.CreateElement("script");
			scriptNode.Attributes.Add("type", "text/javascript");
			scriptNode.InnerHtml = "window.onload = function() { parent.Game.instance.processIFrame(window); };";
			headNode.AppendChild(scriptNode);

			// Replace paths of all images to be absolute.
			var imageNodes = root.SelectNodes("//img");
			foreach (var imageNode in imageNodes)
			{
				if (imageNode.Attributes.Contains("src") && 
					!imageNode.Attributes["src"].Value.Substring(0, 4).ToLower().Equals("http") && 
					!imageNode.Attributes["src"].Value.Substring(0, 2).ToLower().Equals("//") && 
					!imageNode.Attributes["src"].Value.Substring(0, 4).ToLower().Equals("data") )
				{
					imageNode.Attributes["src"].Value = "http://" + url + "/" + imageNode.Attributes["src"].Value;
				}
			}

            return Content(doc.DocumentNode.OuterHtml);
        }
    }
}