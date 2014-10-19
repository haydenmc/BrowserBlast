using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace BrowserBlast.Hubs
{
	public class GameHub : Hub
	{
		private static readonly string[] LevelUrls = new string[] { "http://cnn.com", "http://reddit.com" };
		private static int CurrentLevelIndex = -1;
		private static List<string> ConnectionIds = new List<string>();
		public static HtmlNode CurrentPage { get; protected set; }
		public override Task OnConnected()
		{
			if (CurrentLevelIndex < 0)
			{
				CurrentLevelIndex = 0;
				LoadLevel();
			}
			else
			{
				Clients.Client(Context.ConnectionId).loadLevel();
			}
			foreach (var connection in ConnectionIds)
			{
				Clients.Client(Context.ConnectionId).addPointer(connection);
			}
			ConnectionIds.Add(Context.ConnectionId);
			Clients.AllExcept(Context.ConnectionId).addPointer(Context.ConnectionId);
			return base.OnConnected();
		}
		public override Task OnDisconnected(bool stopCalled)
		{
			ConnectionIds.Remove(Context.ConnectionId);
			Clients.All.removePointer(Context.ConnectionId);
			return base.OnDisconnected(stopCalled);
		}
		public override Task OnReconnected()
		{
			if (!ConnectionIds.Contains(Context.ConnectionId))
			{
				foreach (var connection in ConnectionIds)
				{
					Clients.Client(Context.ConnectionId).addPointer(connection);
				}
				ConnectionIds.Add(Context.ConnectionId);
				Clients.AllExcept(Context.ConnectionId).addPointer(Context.ConnectionId);
			}
			return base.OnReconnected();
		}
		public void UpdatePointer(int newX, int newY)
		{
			Clients.AllExcept(Context.ConnectionId).updatePointer(Context.ConnectionId, newX, newY);
		}

		public void KillElement(string id)
		{
			var node = CurrentPage.SelectSingleNode("//*[@id='" + id + "']");
			if (node != null)
			{
				node.ParentNode.RemoveChild(node);
			}
			Clients.AllExcept(Context.ConnectionId).killElement(id);
		}

		private void LoadLevel()
		{
			CurrentPage = _GetWebContent(LevelUrls[CurrentLevelIndex]);
			Clients.All.loadLevel();
		}

		private HtmlNode _GetWebContent(string url)
		{
			//bla bla bla darren still smells
			//TODO: check valid url
			HtmlWeb web = new HtmlWeb();
			HtmlDocument doc = web.Load(url);
			var root = doc.DocumentNode;

			// Kill all of the JS
			var jsNodes = root.SelectNodes("//script");
			if (jsNodes != null)
			{
				foreach (var jsNode in jsNodes)
				{
					jsNode.Remove();
				}
			}

			// Kill any nested iframes
			var iframeNodes = root.SelectNodes("//iframe");
			if (iframeNodes != null)
			{
				foreach (var iframeNode in iframeNodes)
				{
					iframeNode.Remove();
				}
			}

			// Inject JS into the head node
			var headNode = root.SelectSingleNode("//head");
			var scriptNode = doc.CreateElement("script");
			scriptNode.Attributes.Add("type", "text/javascript");
			scriptNode.InnerHtml = "window.onload = function() { parent.Game.instance.processIFrame(window); };";
			headNode.AppendChild(scriptNode);

			// Kill all of the links
			var linkNodes = root.SelectNodes("//a");
			foreach (var linkNode in linkNodes)
			{
				if (linkNode.Attributes["href"] != null)
				{
					linkNode.Attributes["href"].Value = "javascript:;";
				}
				else
				{
					linkNode.Attributes.Add("href", "javascript:;");
				}
			}

			// a, img, p, h1, h2, h3, input, button, li
			var idNodes = root.SelectNodes("//a | //img | //p | //h1 | //h2 | //h3 | //input | //button | //li");
			for (int i = 0; i < idNodes.Count; i++)
			{
				if (idNodes[i].Attributes["id"] == null || idNodes[i].Attributes["id"].Value.Length <= 0)
				{
					idNodes[i].Attributes.Add("id", "BlastElement_" + i);
				}
			}

			// Remove onclicks
			var clickNodes = root.SelectNodes("//*[@onclick]");
			if (clickNodes != null)
			{
				for (int i = 0; i < clickNodes.Count; i++)
				{
					if (clickNodes[i].Attributes.Contains("onclick"))
					{
						clickNodes[i].Attributes.Remove("onclick");
					}
				}
			}

			// Remove onhover
			var hoverNodes = root.SelectNodes("//*[@onhover]");
			if (hoverNodes != null)
			{
				for (int i = 0; i < hoverNodes.Count; i++)
				{
					if (hoverNodes[i].Attributes.Contains("onhover"))
					{
						hoverNodes[i].Attributes.Remove("onhover");
					}
				}
			}

			// Remove onhover
			var changeNodes = root.SelectNodes("//*[@onchange]");
			if (changeNodes != null)
			{
				for (int i = 0; i < changeNodes.Count; i++)
				{
					if (changeNodes[i].Attributes.Contains("onchange"))
					{
						changeNodes[i].Attributes.Remove("onchange");
					}
				}
			}

			// Replace paths of all images to be absolute.
			var imageNodes = root.SelectNodes("//img");
			if (imageNodes != null)
			{
				foreach (var imageNode in imageNodes)
				{
					if (imageNode.Attributes.Contains("src") &&
						!imageNode.Attributes["src"].Value.Substring(0, 4).ToLower().Equals("http") &&
						!imageNode.Attributes["src"].Value.Substring(0, 2).ToLower().Equals("//") &&
						!imageNode.Attributes["src"].Value.Substring(0, 4).ToLower().Equals("data"))
					{
						imageNode.Attributes["src"].Value = url + "/" + imageNode.Attributes["src"].Value;
					}
				}
			}

			return doc.DocumentNode;
		}
	}
}